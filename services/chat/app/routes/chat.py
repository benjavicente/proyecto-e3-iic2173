import asyncio

from aioredis import Redis
from fastapi import APIRouter, Depends, WebSocket
from pydantic import ValidationError, parse_obj_as, parse_raw_as
from sqlmodel import Session, select

from .. import all_chats
from ..auth import JWTValidationError, validate_token
from ..connections import ConnectionManager
from ..dependencies import get_db_session, get_redis_client, get_user_token
from ..models.messages import (
    MessageInput,
    MessageOutput,
    PrivateMessage,
    PrivateMessageDB,
    PrivateMessageInput,
    PublicMessage,
    PublicMessageDB,
    PublicMessageInput,
)
from ..models.users import UserToken

chat_router = APIRouter(prefix="/chat", tags=["Chat"])
connection_manager = ConnectionManager()


@chat_router.get("/", response_model=list[all_chats.Chat])
def get_all_private_chats(user_token: UserToken = Depends(get_user_token)):
    "Get all chats of the logged-in user"
    return all_chats.Chat.all(user_id=user_token.user_id)


@chat_router.get("/public", response_model=list[PublicMessage])
def public_chat_history(db_session: Session = Depends(get_db_session)):
    "Get the messages of the public chat"
    return db_session.exec(select(PublicMessageDB)).all()


@chat_router.get("/u/{other_user_id}", response_model=list[PrivateMessage])
def chat_messages(
    other_user_id: str,
    user_token: UserToken = Depends(get_user_token),
    db_session: Session = Depends(get_db_session),
):
    "Get the messages of the chat with the other user"
    return db_session.exec(
        select(PrivateMessageDB).where(
            PrivateMessageDB.from_user_id == user_token.user_id,
            PrivateMessageDB.to_user_id == other_user_id,
        )
    ).all()


@chat_router.websocket("/ws")
async def chat_websocket(
    ws: WebSocket,
    token: str,
    db_session: Session = Depends(get_db_session),
    redis: Redis = Depends(get_redis_client),
):
    "Handle the chat websocket"
    await ws.accept()

    try:
        user_info = validate_token(token)
        await ws.send_json({"status": "ok"})
    except JWTValidationError as jwt_validation_error:
        await ws.send_json({"error": jwt_validation_error.error})
        await ws.close(reason=jwt_validation_error.error)
        return

    redis_task = handle_redis_messages(redis, user_info, ws)
    user_task = handle_user_messages(redis, db_session, user_info, ws)
    _, pending = await asyncio.wait([redis_task, user_task], return_when=asyncio.FIRST_COMPLETED)

    for task in pending:
        task.cancel()


async def handle_redis_messages(redis: Redis, user_info: UserToken, ws: WebSocket):
    "Handles the messages received from redis Pub/Sub"
    pubsub = redis.pubsub()
    await pubsub.subscribe("chat")
    while True:
        message_received = await pubsub.get_message(ignore_subscribe_messages=True)
        if not message_received:
            await asyncio.sleep(0.1)
            continue

        message = parse_raw_as(MessageOutput, message_received["data"])

        if isinstance(message, PublicMessage):
            await ws.send_text(message.json())
        elif isinstance(message, PrivateMessage):
            if message.from_user_id == user_info.user_id:
                await ws.send_text(message.json())
            elif message.to_user_id == user_info.user_id:
                await ws.send_text(message.json())


async def handle_user_messages(
    redis: Redis, db_session: Session, user_info: UserToken, ws: WebSocket
):
    "Handles the incoming messages from the user, sending a message to redis Pub/Sub"
    async for message_received in connection_manager.listen(ws):
        # Parse the actions from the message
        try:
            message_payload = parse_obj_as(MessageInput, message_received)
        except ValidationError as error:
            await ws.send_json({"error": error.errors()})
            continue

        # Save it to the database
        if isinstance(message_payload, PublicMessageInput):
            # ...to the public chat

            # Save the message in the database
            public_msg_db = PublicMessageDB(
                message=message_payload.message,
                from_user_id=user_info.user_id,
            )
            db_session.add(public_msg_db)
            db_session.commit()

            # Send the message to all connected users
            assert public_msg_db.id
            public_ms = PublicMessage(
                id=public_msg_db.id,
                message=message_payload.message,
                from_user_id=user_info.user_id,
                created_at=public_msg_db.created_at,
            )
            await redis.publish("chat", public_ms.json())

        elif isinstance(message_payload, PrivateMessageInput):
            # ...to a private chat

            # Save the message in the database
            private_msg_db = PrivateMessageDB(
                message=message_payload.message,
                from_user_id=user_info.user_id,
                to_user_id=message_payload.to_user_id,
            )
            db_session.add(private_msg_db)
            db_session.commit()

            # Send the message to the other user
            assert private_msg_db.id
            private_ms = PrivateMessage(
                message=private_msg_db.message,
                id=private_msg_db.id,
                from_user_id=private_msg_db.from_user_id,
                to_user_id=private_msg_db.to_user_id,
                created_at=private_msg_db.created_at,
            )
            await redis.publish("chat", private_ms.json())

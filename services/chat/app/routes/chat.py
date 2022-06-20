from fastapi import APIRouter, Depends, WebSocket
from pydantic import ValidationError, parse_obj_as
from sqlmodel import Session, select

from app import all_chats

from ..auth import JWTValidationError, validate_token
from ..connections import ConnectionManager
from ..dependencies import get_db_session, get_user_token
from ..models.messages import (
    MessageInput,
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
    websocket: WebSocket,
    token: str,
    db_session: Session = Depends(get_db_session),
):
    "Handle the chat websocket"
    await websocket.accept()

    try:
        user_info = validate_token(token)
        await websocket.send_json({"status": "ok"})
    except JWTValidationError as jwt_validation_error:
        await websocket.send_json({"error": jwt_validation_error.error})
        await websocket.close(reason=jwt_validation_error.error)
        return

    async for message_received in connection_manager.listen(user_info.user_id, websocket):
        # Parse the actions from the message
        try:
            message_payload = parse_obj_as(MessageInput, message_received)
        except ValidationError as error:
            await websocket.send_json({"error": str(error)})
            await websocket.send_text(error.json())
            continue

        # Send the message...
        if isinstance(message_payload, PublicMessageInput):
            # ...to the public chat

            # Save the message in the database
            public_msg_db = PublicMessageDB(
                message=message_payload.message,
                from_user_id=user_info.user_id,
            )
            db_session.add(public_msg_db)

            # Send the message to all connected users
            public_ms = PublicMessage.construct(public_msg_db.__fields_set__)
            for connection in connection_manager.connections.values():
                if connection is websocket:
                    continue
                await connection.send_text(public_ms.json())

        elif isinstance(message_payload, PrivateMessageInput):
            # ...to a private chat

            # Save the message in the database
            private_msg_db = PrivateMessageDB(
                message=message_payload.message,
                from_user_id=user_info.user_id,
                to_user_id=message_payload.to_user_id,
            )
            db_session.add(private_msg_db)

            # Send the message to the other user
            private_ms = PrivateMessage.construct(private_msg_db.__fields_set__)
            other_user_websocket = connection_manager.connections.get(message_payload.to_user_id)
            if other_user_websocket:
                await other_user_websocket.send_text(private_ms.json())

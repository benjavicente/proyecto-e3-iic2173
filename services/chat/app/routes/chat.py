from fastapi import APIRouter, WebSocket, Depends
from ..dependencies import get_user_token


chat_router = APIRouter(prefix="/chat", tags=["chat"])


@chat_router.get("/")
def get_all_chats(user_token=Depends(get_user_token)):
    print(user_token)


@chat_router.get("/public")
def public_chat_history():
    pass


@chat_router.websocket("/public")
def public_chat_websocket(websocket: WebSocket):
    pass


user_chat_router = APIRouter(prefix="/u", tags=["users chat"])
chat_router.include_router(user_chat_router)


@user_chat_router.get("{other_user_id}")
def chat_messages(other_user_id: int):
    pass


@user_chat_router.websocket("{other_user_id}")
async def chat_websocket(websocket: WebSocket):
    pass

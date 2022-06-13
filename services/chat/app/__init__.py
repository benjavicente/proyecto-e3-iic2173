from fastapi import FastAPI

from .docs import custom_openapi
from .db import init_db
from .routes.chat import chat_router


app = FastAPI()
app.openapi = custom_openapi(app)
app.include_router(chat_router)


@app.on_event("startup")
def startup():
    init_db()


@app.get("/", tags=["Ping"])
def ping():
    return {"message": "pong"}

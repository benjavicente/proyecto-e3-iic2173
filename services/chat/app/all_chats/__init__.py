from datetime import datetime
from pathlib import Path
from sqlmodel import SQLModel, Field
from pydantic import parse_obj_as
from sqlalchemy import text

from ..db import engine

SQL_QUERY = Path(__file__).parent.joinpath("query.sql").read_text()


class Chat(SQLModel):
    "'Virtual table' that represents all chats of a user"
    other_user_id: str = Field(..., primary_key=True, description="User ID of the other user")
    last_at: datetime = Field(..., description="Last message date")

    @classmethod
    def all(cls, user_id: str):
        with engine.connect() as conn:
            result = conn.execute(text(SQL_QUERY), {"user_id": user_id})
        return parse_obj_as(list[cls], result.all())

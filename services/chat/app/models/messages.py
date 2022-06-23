from datetime import datetime
from typing import ClassVar, Literal, Union

from pydantic import BaseModel
from sqlmodel import Field, SQLModel


# Other
class MessageToUser(BaseModel):
    to_user_id: str = Field(min_length=1, description="User ID of the recipient")


# Inputs


class BaseMessageInput(BaseModel):
    "Base message input model"
    message: str = Field(min_length=1, description="Message text")


class PrivateMessageInput(BaseMessageInput, MessageToUser):
    "WebSocket message for private messages"
    type: Literal["private"] = Field(description="Message type")


class PublicMessageInput(BaseMessageInput):
    "WebSocket message for public messages"
    type: Literal["public"] = Field(description="Message type")


MessageInput = Union[PublicMessageInput, PrivateMessageInput]


# Outputs


class BaseMessage(BaseMessageInput):
    "Base class for messages"
    id: int = Field(..., description="Message ID")
    email: str = Field(..., description="Email of the sender")
    from_user_id: str = Field(..., description="User ID of the sender")
    created_at: datetime = Field(default_factory=datetime.now, description="Creation date")


class PrivateMessage(BaseMessage, MessageToUser):
    "Private message"


class PublicMessage(BaseMessage):
    "Public message"


MessageOutput = Union[PrivateMessage, PublicMessage]


# Database


class BaseMessageDB(SQLModel, BaseMessage):
    "Base class for messages in the database"
    id: Union[int, None] = Field(default=None, primary_key=True)


class PrivateMessageDB(BaseMessageDB, MessageToUser, table=True):
    "Private message saved in the database"
    __tablename__: ClassVar[str] = "private_messages"


class PublicMessageDB(BaseMessageDB, table=True):
    "Public message saved in the database"
    __tablename__: ClassVar[str] = "public_messages"

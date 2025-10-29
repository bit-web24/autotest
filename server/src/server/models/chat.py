from pydantic import BaseModel, Field
import datetime


class Message(BaseModel):
    id: str
    request: str
    response: str | None
    created_at: datetime.datetime
    updated_at: datetime.datetime


class Chat(BaseModel):
    id: str = Field(alias="_id")
    name: str
    messages: list[Message]
    created_at: datetime.datetime
    updated_at: datetime.datetime


class ChatCreate(BaseModel):
    name: str


class ToolCall(BaseModel):
    id: str
    name: str
    arguments: dict[str, str]

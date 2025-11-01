from pydantic import BaseModel, Field
import datetime


class Message(BaseModel):
    id: str = Field(alias="_id")
    request: str
    response: str | None = None
    created_at: datetime.datetime
    updated_at: datetime.datetime


class MessageCreate(BaseModel):
    request: str
    response: str | None = None


class MessageUpdate(BaseModel):
    request: str | None = None
    response: str | None = None


class Chat(BaseModel):
    id: str = Field(alias="_id")
    name: str
    messages: list[str]
    created_at: datetime.datetime
    updated_at: datetime.datetime


class ChatCreate(BaseModel):
    name: str


class ChatUpdate(BaseModel):
    name: str | None = None


class ToolCall(BaseModel):
    id: str
    name: str
    arguments: dict[str, str]

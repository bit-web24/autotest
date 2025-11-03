from typing import TypedDict
from pydantic import BaseModel


class ToolCall(TypedDict):
    tool: str
    input: str


class Event(TypedDict):
    type: ToolCall | None
    status: str


class UserInput(BaseModel):
    """User message input"""

    input: str

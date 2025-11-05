from typing import Any, TypedDict
from pydantic import BaseModel


class ToolCall(TypedDict):
    tool: str
    input: str


class UserInput(BaseModel):
    """User message input"""

    input: str


class Event(BaseModel):
    name: str
    payload: dict[str, Any] | None = None

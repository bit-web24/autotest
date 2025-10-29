from typing import TypedDict


class ToolCall(TypedDict):
    tool: str
    input: str


class Event(TypedDict):
    type: ToolCall | None
    status: str

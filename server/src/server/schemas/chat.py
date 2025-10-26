from typing import TypedDict


class Message(TypedDict):
    id: str
    request: str
    response: str | None


class Chat(TypedDict):
    id: str
    name: str
    messages: list[Message] | None


class ToolCall(TypedDict):
    id: str
    name: str
    arguments: dict[str, str]

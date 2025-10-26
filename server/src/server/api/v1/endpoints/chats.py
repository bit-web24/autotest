from fastapi import APIRouter
from server.services.chat_service import ChatService
from server.schemas.chat import Message

router = APIRouter(prefix="/chats")
chat_service = ChatService()


@router.post("/")
async def create_chat(name: str):
    """Create a new chat."""
    return await chat_service.create(name)


@router.get("/")
async def get_chats():
    """Get all chats."""
    return await chat_service.gets()


@router.get("/{chat_id}")
async def get_chat(chat_id: str):
    """Get a chat by ID."""
    return await chat_service.get(chat_id)


@router.put("/{chat_id}")
async def update_chat(chat_id: str, name: str):
    """Update a chat by ID."""
    return await chat_service.update(chat_id, name)


@router.delete("/{chat_id}")
async def delete_chat(chat_id: str):
    """Delete a chat by ID."""
    return await chat_service.delete(chat_id)


# sub-route: /{chat_id}/messages/
# Manages messages in a chat


@router.post("/{chat_id}/message")
async def add_message(chat_id: str, message: Message):
    """Add a new pair of messages e.g. [HumanMessage, AIMessage], in a chat."""
    return await chat_service.add_message(chat_id, message)


@router.get("/{chat_id}/message")
async def get_messages(chat_id: str, limit: int):
    """Get all/limited messages in a chat."""
    return await chat_service.get_messages(chat_id, limit)


@router.get("/{chat_id}/message")
async def get_message(chat_id: str, message_id: str):
    """Get a message by ID in a chat."""
    return await chat_service.get_message(chat_id, message_id)


@router.put("/{chat_id}/message/{message_id}")
async def update_message(chat_id: str, message_id: str, message: Message):
    """Update a message by ID in a chat."""
    return await chat_service.update_message(chat_id, message_id, message)


@router.delete("/{chat_id}/message/{message_id}")
async def delete_message(chat_id: str, message_id: str):
    """Delete a message by ID in a chat."""
    return await chat_service.delete_message(chat_id, message_id)

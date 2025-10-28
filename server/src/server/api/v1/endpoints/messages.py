from fastapi import APIRouter
from server.schemas.chat import Message
from server.services.chat_service import ChatService

chat_service = ChatService()

router = APIRouter(
    prefix="/{chat_id}/messages",
    tags=["Messages"]
)


@router.post("/")
async def add_message(chat_id: str, message: Message):
    """Add a message to a chat."""
    return await chat_service.add_message(chat_id, message)


@router.get("/")
async def get_messages(chat_id: str, limit: int | None = None):
    """Get all or limited messages in a chat."""
    return await chat_service.get_messages(chat_id, limit)


@router.get("/{message_id}")
async def get_message(chat_id: str, message_id: str):
    """Get a single message by ID."""
    return await chat_service.get_message(chat_id, message_id)


@router.put("/{message_id}")
async def update_message(chat_id: str, message_id: str, message: Message):
    """Update a message by ID."""
    return await chat_service.update_message(chat_id, message_id, message)


@router.delete("/{message_id}")
async def delete_message(chat_id: str, message_id: str):
    """Delete a message by ID."""
    return await chat_service.delete_message(chat_id, message_id)

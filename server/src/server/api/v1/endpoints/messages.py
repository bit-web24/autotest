from typing import Any
from fastapi import APIRouter
from server.models.chat import Message
from server.services.chat_service import ChatService
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter(prefix="/{chat_id}/messages", tags=["Messages"])


@router.post("/")
async def add_message(
    chat_id: str,
    message: Message,
    db: AsyncIOMotorDatabase[dict[str, Any]],
):
    """Add a message to a chat."""
    chat_service = ChatService(db)
    return await chat_service.add_message(chat_id, message)


@router.get("/")
async def get_messages(
    chat_id: str,
    db: AsyncIOMotorDatabase[dict[str, Any]],
    limit: int | None = None,
):
    """Get all or limited messages in a chat."""
    chat_service = ChatService(db)
    return await chat_service.get_messages(chat_id, limit)


@router.get("/{message_id}")
async def get_message(
    chat_id: str,
    message_id: str,
    db: AsyncIOMotorDatabase[dict[str, Any]],
):
    """Get a single message by ID."""
    chat_service = ChatService(db)
    return await chat_service.get_message(chat_id, message_id)


@router.put("/{message_id}")
async def update_message(
    chat_id: str,
    message_id: str,
    message: Message,
    db: AsyncIOMotorDatabase[dict[str, Any]],
):
    """Update a message by ID."""
    chat_service = ChatService(db)
    return await chat_service.update_message(chat_id, message_id, message)


@router.delete("/{message_id}")
async def delete_message(
    chat_id: str,
    message_id: str,
    db: AsyncIOMotorDatabase[dict[str, Any]],
):
    """Delete a message by ID."""
    chat_service = ChatService(db)
    return await chat_service.delete_message(chat_id, message_id)

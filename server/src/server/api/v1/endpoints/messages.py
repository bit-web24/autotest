from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from server.models.chat import Message
from server.services.chat_service import ChatService
from motor.motor_asyncio import AsyncIOMotorDatabase
from server.core.database import get_database

router = APIRouter(prefix="/{chat_id}/messages", tags=["Messages"])


@router.post(
    "/",
    response_model=Message,
    status_code=201,
)
async def add_message(
    chat_id: str,
    message: Message,
    db: AsyncIOMotorDatabase[dict[str, Any]] = Depends(get_database),
):
    """Add a message to a chat."""
    chat_service = ChatService(db)
    try:
        msg = await chat_service.add_message(chat_id, message)
        if not msg:
            raise HTTPException(status_code=400, detail="Failed to add message")
        return msg
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/",
    response_model=list[Message],
    status_code=200,
)
async def get_messages(
    chat_id: str,
    db: AsyncIOMotorDatabase[dict[str, Any]] = Depends(get_database),
    limit: int | None = None,
):
    """Get all or limited messages in a chat."""
    chat_service = ChatService(db)
    try:
        msgs = await chat_service.get_messages(chat_id, limit)
        if msgs is None:
            raise HTTPException(status_code=404, detail="Error fetching messages")
        return msgs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/{message_id}",
    response_model=Message,
    status_code=200,
)
async def get_message(
    chat_id: str,
    message_id: str,
    db: AsyncIOMotorDatabase[dict[str, Any]] = Depends(get_database),
):
    """Get a single message by ID."""
    chat_service = ChatService(db)
    try:
        msg = await chat_service.get_message(chat_id, message_id)
        if msg is None:
            raise HTTPException(status_code=404, detail="Message not found")
        return msg
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put(
    "/{message_id}",
    response_model=Message,
    status_code=200,
)
async def update_message(
    chat_id: str,
    message_id: str,
    message: Message,
    db: AsyncIOMotorDatabase[dict[str, Any]] = Depends(get_database),
):
    """Update a message by ID."""
    chat_service = ChatService(db)
    try:
        msg = await chat_service.get_message(chat_id, message_id)
        if msg is None:
            raise HTTPException(status_code=404, detail="Message not found")
        return await chat_service.update_message(chat_id, message_id, message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete(
    "/{message_id}",
    response_model=int,
    status_code=204,
)
async def delete_message(
    chat_id: str,
    message_id: str,
    db: AsyncIOMotorDatabase[dict[str, Any]] = Depends(get_database),
):
    """Delete a message by ID."""
    chat_service = ChatService(db)
    try:
        result = await chat_service.delete_message(chat_id, message_id)
        if result is None:
            raise HTTPException(status_code=404, detail="Chat not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

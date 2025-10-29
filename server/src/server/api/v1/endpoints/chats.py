from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from server.services.chat_service import ChatService

from server.api.v1.endpoints.messages import router as message_router
from server.api.v1.endpoints.events import router as event_router
from server.models.chat import Chat, ChatCreate, ChatUpdate
from server.core.database import get_database

from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter()


@router.post(
    "/",
    response_model=Chat,
    status_code=201,
)
async def create_chat(
    chat: ChatCreate,
    db: AsyncIOMotorDatabase[dict[str, Any]] = Depends(get_database),
):
    """Create a new chat."""
    try:
        chat_service = ChatService(db)
        _chat = await chat_service.create(chat)
        if not _chat:
            raise HTTPException(status_code=500, detail="Failed to create chat")
        return _chat
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/",
    response_model=list[Chat],
)
async def get_chats(
    db: AsyncIOMotorDatabase[dict[str, Any]] = Depends(get_database),
):
    """Get all chats."""
    try:
        chat_service = ChatService(db)
        chats = await chat_service.gets()
        if chats is None:
            raise HTTPException(status_code=404, detail="Chats Not Found")
        return chats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/{chat_id}",
    response_model=Chat,
)
async def get_chat(
    chat_id: str,
    db: AsyncIOMotorDatabase[dict[str, Any]] = Depends(get_database),
):
    """Get a chat by ID."""
    try:
        chat_service = ChatService(db)
        chat = await chat_service.get(chat_id)
        if not chat:
            raise HTTPException(status_code=404, detail="Chat Not Found")
        return chat
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put(
    "/{chat_id}",
    response_model=Chat,
)
async def update_chat(
    chat_id: str,
    chat: ChatUpdate,
    db: AsyncIOMotorDatabase[dict[str, Any]] = Depends(get_database),
):
    """Update a chat by ID."""
    try:
        chat_service = ChatService(db)
        _chat = await chat_service.update(chat_id, chat)
        if not _chat:
            raise HTTPException(status_code=404, detail="Chat Could Not Be Updated")
        return _chat
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{chat_id}")
async def delete_chat(
    chat_id: str,
    db: AsyncIOMotorDatabase[dict[str, Any]] = Depends(get_database),
):
    """Delete a chat by ID."""
    try:
        chat_service = ChatService(db)
        result = await chat_service.delete(chat_id)
        if result is None:
            raise HTTPException(status_code=404, detail="Chat Not Found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


router.include_router(message_router)
router.include_router(event_router)

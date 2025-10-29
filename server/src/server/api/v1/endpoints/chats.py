from typing import Any
from fastapi import APIRouter, Depends
from server.services.chat_service import ChatService

from server.api.v1.endpoints.messages import router as message_router
from server.api.v1.endpoints.events import router as event_router
from server.models.chat import Chat, ChatCreate
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
    chat_service = ChatService(db)
    return await chat_service.create(chat)


@router.get(
    "/",
    response_model=list[Chat],
)
async def get_chats(
    db: AsyncIOMotorDatabase[dict[str, Any]] = Depends(get_database),
):
    """Get all chats."""
    chat_service = ChatService(db)
    return await chat_service.gets()


@router.get(
    "/{chat_id}",
    response_model=Chat,
)
async def get_chat(
    chat_id: str,
    db: AsyncIOMotorDatabase[dict[str, Any]] = Depends(get_database),
):
    """Get a chat by ID."""
    chat_service = ChatService(db)
    return await chat_service.get(chat_id)


@router.put(
    "/{chat_id}",
    response_model=Chat,
)
async def update_chat(
    chat_id: str,
    name: str,
    db: AsyncIOMotorDatabase[dict[str, Any]] = Depends(get_database),
):
    """Update a chat by ID."""
    chat_service = ChatService(db)
    return await chat_service.update(chat_id, name)


@router.delete("/{chat_id}")
async def delete_chat(
    chat_id: str,
    db: AsyncIOMotorDatabase[dict[str, Any]] = Depends(get_database),
):
    """Delete a chat by ID."""
    chat_service = ChatService(db)
    return await chat_service.delete(chat_id)


router.include_router(message_router)
router.include_router(event_router)

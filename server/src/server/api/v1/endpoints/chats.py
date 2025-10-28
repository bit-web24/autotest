from fastapi import APIRouter
from server.services.chat_service import ChatService
from server.schemas.chat import Message
from server.api.v1.endpoints.messages import router as message_router
from server.api.v1.endpoints.events import router as event_router

router = APIRouter()
chat_service = ChatService()


@router.post("/")
async def create_chat(name: str):
    """Create a new chat."""
    print("Creating chat...")
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


router.include_router(message_router)
router.include_router(event_router)

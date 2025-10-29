from fastapi import APIRouter, FastAPI, Query, Depends, Request
from fastapi.responses import StreamingResponse

from server.services.events_service import EventService

router = APIRouter(prefix="/{chat_id}/events", tags=["Events"])


def get_event_service(request: Request) -> EventService:
    service = getattr(request.app.state, "event_service", None)
    if service is None:
        raise RuntimeError("EventService not initialized")
    print(f"Event service retrieved: {service.agent.name}")
    return service


@router.get("/")
async def get_events(chat_id: str):
    """Fetch all stored/past events for a chat."""
    print("testing get_events")


@router.get("/stream")
async def stream_events(
    chat_id: str,
    user_input: str = Query(..., description="User message input"),
    service: EventService = Depends(get_event_service),
):
    print(f"Streaming events for chat {chat_id}; {service.agent.name}")
    stream = service.stream_events(chat_id, user_input)
    return StreamingResponse(stream, media_type="text/event-stream")


# @router.get("/history")
# async def get_event_history(chat_id: str):
#     """Fetch all stored/past events for a chat."""
#     return await event_service.get_events(chat_id)

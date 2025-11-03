from fastapi import APIRouter, FastAPI, Query, Depends, Request
from fastapi.responses import StreamingResponse

from server.services.events_service import EventService
from server.core.agent import agent
from server.models.event import UserInput

router = APIRouter(prefix="/{chat_id}/events", tags=["Events"])


@router.get("/stream")
async def stream_events(
    chat_id: str,
    user_input: UserInput,
    service: EventService = Depends(agent.get_event_service),
):
    print(f"Streaming events for chat {chat_id}; {service.agent.name}")
    stream = service.stream_events(chat_id, user_input.input)
    return StreamingResponse(stream, media_type="text/event-stream")

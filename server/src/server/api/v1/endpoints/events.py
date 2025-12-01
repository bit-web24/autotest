from fastapi import APIRouter, Depends, FastAPI, Query, Request
from fastapi.responses import StreamingResponse

from server.core.agent import agent
from server.models.event import UserInput
from server.services.events_service import EventService

router = APIRouter(prefix="/{chat_id}/events", tags=["Events"])


@router.post("/stream")
async def stream_events(
    chat_id: str,
    user_input: UserInput,
    service: EventService = Depends(agent.get_event_service),
):
    print(f"Streaming events for chat {chat_id}; {service.agent.name}")
    stream = service.stream_events(chat_id, user_input.input)
    return StreamingResponse(
        stream,
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "text/event-stream",
        },
    )

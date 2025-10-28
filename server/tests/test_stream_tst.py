import pytest
from httpx import AsyncClient
from fastapi.testclient import TestClient
import json


@pytest.mark.asyncio
async def test_stream_endpoint():
    # Using TestClient for sync test
    from server.main import app  # Import your FastAPI app

    client = TestClient(app)

    with client.stream(
        "GET",
        "/api/v1/chats/123/events/stream",
        params={"chat_id": "test123", "user_input": "Hello"},
    ) as response:
        assert response.status_code == 200
        assert response.headers["content-type"] == "text/event-stream"

        events = []
        for line in response.iter_lines():
            if line.startswith("data: "):
                data = line[6:]
                try:
                    event = json.loads(data)
                    events.append(event)
                except json.JSONDecodeError:
                    pass

        # Assert expected events
        assert len(events) > 0
        assert any(e["type"] == "token" for e in events)

import pytest
import httpx


@pytest.mark.asyncio
async def test_stream_events():
    url = "http://localhost:8000/api/v1/chats/123/events/stream"
    params = {
        "user_input": "hello",
        "chat_id": "123",
    }

    async with httpx.AsyncClient(timeout=None) as client:
        async with client.stream("GET", url, params=params) as response:
            assert response.status_code == 200
            chunks = []
            async for line in response.aiter_lines():
                if line.startswith("data:"):
                    chunks.append(line)
                    print("STREAM:", line)
            assert len(chunks) > 0, "No stream data received"

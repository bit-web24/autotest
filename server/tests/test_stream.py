import pytest
import httpx
# import asyncio


@pytest.mark.asyncio
async def test_stream_events():
    url = "http://localhost:8000/chats/123/events/stream"
    params = {"user_input": "Test streaming"}

    async with httpx.AsyncClient(timeout=None) as client:
        async with client.stream("GET", url, params=params) as response:
            assert response.status_code == 200
            chunks = []
            async for line in response.aiter_lines():
                if line.startswith("data:"):
                    chunks.append(line)
                    print("STREAM:", line)
                    if len(chunks) >= 3:  # stop after few lines
                        break
            assert len(chunks) > 0, "No stream data received"


# import requests
# import json

# url = "http://localhost:8000/chats/123/events/stream"
# params = {"chat_id": "test123", "user_input": "What is the weather today?"}

# with requests.get(url, params=params, stream=True) as response:
#     for line in response.iter_lines():
#         if line:
#             decoded = line.decode("utf-8")
#             print(decoded)

#             # Parse SSE format
#             if decoded.startswith("data: "):
#                 data = decoded[6:]  # Remove 'data: ' prefix
#                 try:
#                     event = json.loads(data)
#                     print(f"Event type: {event.get('type')}")
#                     print(f"Content: {event}")
#                 except json.JSONDecodeError:
#                     print(f"Raw data: {data}")

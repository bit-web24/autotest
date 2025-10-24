import asyncio
from fastmcp import Client

client = Client("http://localhost:8000/mcp")

async def call_tool(a: int, b: int):
    async with client:
        result = await client.call_tool("add", {"a": a, "b": b})
        print(result)

asyncio.run(call_tool(1, 2))

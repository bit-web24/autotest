from tkinter.constants import W
from langchain_mcp_adapters.client import MultiServerMCPClient
from settings import WORK_DIR

client = MultiServerMCPClient(
    {
        "filesystem": {
            "transport": "stdio",
            "command": "npx",
            "args": [
                "-y",
                "@modelcontextprotocol/server-filesystem",
                f"{WORK_DIR}",
            ],
        },
        "context7": {
            "transport": "stdio",
            "command": "npx",
            "args": ["-y", "@upstash/context7-mcp@latest"],
        },
        "shell": {"transport": "streamable_http", "url": "http://127.0.0.1:8081/mcp"},
    }
)

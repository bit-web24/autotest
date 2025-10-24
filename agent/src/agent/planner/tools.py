from langchain_mcp_adapters.client import MultiServerMCPClient
from agent.settings import WORK_DIR


client = MultiServerMCPClient(
    {
        "filesystem": {
            "transport": "stdio",
            "command": "npx",
            "args": [
                "-y",
                "@modelcontextprotocol/server-filesystem",
                f"{WORK_DIR.absolute()}",
            ],
        },
    }
)

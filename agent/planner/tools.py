from langchain_mcp_adapters.client import MultiServerMCPClient

client = MultiServerMCPClient(
    {
        # "tool-1": {
        #     "transport": "streamable_http",
        #     "url": "http://127.0.0.1:8000/mcp/",
        # }
    }
)

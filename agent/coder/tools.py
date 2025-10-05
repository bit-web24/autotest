from langchain_mcp_adapters.client import MultiServerMCPClient
from pathlib import Path

tmp_dir = Path.cwd() / "projects"
tmp_dir.mkdir(exist_ok=True)

client = MultiServerMCPClient(
    {
        "filesystem": {
            "command": "docker",
            "args": [
                "run",
                "-i",
                "--rm",
                "--mount",
                f"type=bind,src={tmp_dir.absolute()},dst=/projects",
                "mcp/filesystem",
                "/projects",
            ],
            "transport": "stdio",
            "env": {
                "PYTHONWARNINGS": "ignore",
            },
        }
    }
)

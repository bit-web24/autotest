"""
MCP Server for running Linux shell commands
Uses FastMCP 2.0 to provide shell command execution capabilities
Runs via HTTP transport and executes commands in a specified working directory
"""

from pathlib import Path
import sys
import subprocess
import shlex

from fastmcp import FastMCP

from settings import WORK_DIR

PROJECT_ROOT = Path(__file__).resolve().parents[2]
sys.path.append(str(PROJECT_ROOT))


# Initialize FastMCP server
mcp = FastMCP(
    name="shell-commander",
    instructions="This server lets you run Linux shell commands.",
)


@mcp.tool()
async def run_shell_command(
    command: str, timeout: int = 30, capture_output: bool = True, cwd: str | None = None
) -> dict:
    """
    Execute a shell command and return the result.

    Args:
        command: The shell command to execute
        timeout: Maximum execution time in seconds (default: 30)
        capture_output: Whether to capture stdout/stderr (default: True)
        cwd: Working directory for command execution (default: projects dir)

    Returns:
        Dictionary containing:
        - returncode: Exit code of the command
        - stdout: Standard output (if captured)
        - stderr: Standard error (if captured)
        - success: Boolean indicating if command succeeded
        - cwd: Working directory used
    """
    return await _execute_shell_command(command, timeout, capture_output, cwd)


# Helper function that does the actual work
async def _execute_shell_command(
    command: str, timeout: int = 30, capture_output: bool = True, cwd: str | None = None
) -> dict:
    """
    Execute a shell command and return the result.

    Args:
        command: The shell command to execute
        timeout: Maximum execution time in seconds (default: 30)
        capture_output: Whether to capture stdout/stderr (default: True)
        cwd: Working directory for command execution (default: projects dir)

    Returns:
        Dictionary containing:
        - returncode: Exit code of the command
        - stdout: Standard output (if captured)
        - stderr: Standard error (if captured)
        - success: Boolean indicating if command succeeded
        - cwd: Working directory used
    """
    # Use default work dir if not specified
    work_dir = Path(cwd) if cwd else WORK_DIR
    work_dir.mkdir(exist_ok=True)

    try:
        # Execute the command
        result = subprocess.run(
            command,
            shell=True,
            capture_output=capture_output,
            text=True,
            timeout=timeout,
            cwd=str(work_dir),
        )

        return {
            "success": result.returncode == 0,
            "returncode": result.returncode,
            "stdout": result.stdout if capture_output else "",
            "stderr": result.stderr if capture_output else "",
            "command": command,
            "cwd": str(work_dir.absolute()),
        }

    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "returncode": -1,
            "stdout": "",
            "stderr": f"Command timed out after {timeout} seconds",
            "command": command,
            "cwd": str(work_dir.absolute()),
        }

    except Exception as e:
        return {
            "success": False,
            "returncode": -1,
            "stdout": "",
            "stderr": str(e),
            "command": command,
            "cwd": str(work_dir.absolute()),
        }


@mcp.tool()
async def execute_command(
    command: str, timeout: int = 30, cwd: str | None = None
) -> dict:
    """
    Execute a shell command with safety restrictions.
    Only allows whitelisted commands or command prefixes.

    Args:
        command: The shell command to execute
        timeout: Maximum execution time in seconds
        cwd: Working directory for command execution (default: projects dir)

    Returns:
        Dictionary with execution results or error message
    """
    # Default safe commands
    allowed_commands = [
        "ls",
        "cat",
        "grep",
        "find",
        "echo",
        "pwd",
        "whoami",
        "date",
        "head",
        "tail",
        "wc",
        "tree",
        "git",
        "python",
        "python3",
        "node",
        "npm",
        "pip",
        "mkdir",
        "touch",
        "cp",
        "mv",
        "rm",
    ]

    # Parse the command to get the base command
    try:
        parts = shlex.split(command)
        if not parts:
            return {
                "success": False,
                "returncode": -1,
                "stdout": "",
                "stderr": "Empty command provided",
                "command": command,
                "cwd": str(WORK_DIR.absolute()),
            }

        base_command = parts[0]

        # Check if command is allowed
        is_allowed = any(
            base_command == allowed or base_command.startswith(allowed + " ")
            for allowed in allowed_commands
        )

        if not is_allowed:
            return {
                "success": False,
                "returncode": -1,
                "stdout": "",
                "stderr": f"Command '{base_command}' not in allowed list: {allowed_commands}",
                "command": command,
                "cwd": str(WORK_DIR.absolute()),
            }

        # Execute if allowed
        return await _execute_shell_command(command, timeout=timeout, cwd=cwd)

    except Exception as e:
        return {
            "success": False,
            "returncode": -1,
            "stdout": "",
            "stderr": f"Error parsing command: {str(e)}",
            "command": command,
            "cwd": str(WORK_DIR.absolute()),
        }


@mcp.tool()
async def list_directory(path: str = ".", cwd: str | None = None) -> dict:
    """
    List contents of a directory.

    Args:
        path: Directory path to list (default: current directory)
        cwd: Working directory (default: projects dir)

    Returns:
        Dictionary with directory listing or error
    """
    command = f"ls -la {shlex.quote(path)}"
    return await _execute_shell_command(command, cwd=cwd)


@mcp.tool()
async def get_system_info() -> dict:
    """
    Get basic system information.

    Returns:
        Dictionary with system information including:
        - hostname, kernel, uptime, etc.
    """
    commands = {
        "hostname": "hostname",
        "kernel": "uname -r",
        "os": "cat /etc/os-release | grep PRETTY_NAME | cut -d= -f2 | tr -d '\"'",
        "uptime": "uptime -p",
        "current_user": "whoami",
        "current_dir": "pwd",
        "work_dir": f"echo {WORK_DIR.absolute()}",
    }

    results = {}
    for key, cmd in commands.items():
        result = await _execute_shell_command(cmd)
        results[key] = result["stdout"].strip() if result["success"] else "N/A"

    return {"success": True, "system_info": results}


async def _get_system_info() -> dict:
    """
    Get basic system information.

    Returns:
        Dictionary with system information including:
        - hostname, kernel, uptime, etc.
    """
    commands = {
        "hostname": "hostname",
        "kernel": "uname -r",
        "os": "cat /etc/os-release | grep PRETTY_NAME | cut -d= -f2 | tr -d '\"'",
        "uptime": "uptime -p",
        "current_user": "whoami",
        "current_dir": "pwd",
        "work_dir": f"echo {WORK_DIR.absolute()}",
    }

    results = {}
    for key, cmd in commands.items():
        result = await _execute_shell_command(cmd)
        results[key] = result["stdout"].strip() if result["success"] else "N/A"

    return {"success": True, "system_info": results}


@mcp.tool()
async def get_work_directory() -> dict:
    """
    Get the current working directory where commands are executed.

    Returns:
        Dictionary with working directory information
    """
    return {
        "success": True,
        "work_dir": str(WORK_DIR.absolute()),
        "exists": WORK_DIR.exists(),
        "is_dir": WORK_DIR.is_dir(),
    }


async def _get_work_directory() -> dict:
    """
    Get the current working directory where commands are executed.

    Returns:
        Dictionary with working directory information
    """
    return {
        "success": True,
        "work_dir": str(WORK_DIR.absolute()),
        "exists": WORK_DIR.exists(),
        "is_dir": WORK_DIR.is_dir(),
    }


@mcp.resource("shell://system-info")
async def system_info_resource() -> str:
    """
    Resource providing system information as text.
    """
    info = await _get_system_info()
    if info["success"]:
        lines = [
            f"{k.replace('_', ' ').title()}: {v}"
            for k, v in info["system_info"].items()
        ]
        return "\n".join(lines)
    return "Failed to retrieve system information"


@mcp.resource("shell://work-dir")
async def work_dir_resource() -> str:
    """
    Resource providing working directory information.
    """
    info = await _get_work_directory()
    return f"Working Directory: {info['work_dir']}\nExists: {info['exists']}\nIs Directory: {info['is_dir']}"


if __name__ == "__main__":
    # Run the MCP server with HTTP transport
    mcp.run(transport="http", host="127.0.0.1", port=8081)

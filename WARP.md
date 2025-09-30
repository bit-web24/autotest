# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**AutoTest** is an Agentic AI system designed for testing random code. It combines multiple AI frameworks and tools to create an intelligent code analysis and testing agent. The system uses LangChain, LangGraph, and Groq API to build a conversational agent that can understand, analyze, and improve code.

## Architecture

### Core Components

**Agent System (`agent/` directory)**
- `agent.py`: Main agent builder using LangGraph with create_react_agent pattern
- `schemas.py`: TypedDict schema for AgentState with message handling
- `memory.py`: SQLite-based checkpoint management for conversation persistence
- `prompts.py`: Comprehensive system prompts defining the agent's capabilities and workflow

**Configuration (`configs/` directory)**  
- `settings.py`: Pydantic-based configuration management using environment variables

**Entry Point**
- `main.py`: CLI interface for interacting with the agent

### Key Architecture Patterns

**Agent Pattern**: Uses LangGraph's `create_react_agent` with:
- ChatGroq model (OpenAI GPT OSS 120B via Groq)
- MultiServerMCPClient for tool integration
- InMemorySaver for session management
- Custom executor prompt for planning capabilities

**State Management**: AgentState schema manages conversation flow using LangChain's `add_messages` for message handling

**Tool Integration**: MCP (Model Context Protocol) client connects to external tools via HTTP streamable transport

**Memory System**: Async SQLite checkpointer for conversation persistence across sessions

## Environment Setup

### Prerequisites
- Python 3.13+
- UV package manager (configured via user rules)

### Environment Variables
Create a `.env` file with:
```
GROQ_API_KEY=your_groq_api_key
DEBUG=True
AGENT_NAME=AutoTest  
MODEL=llama2-70b-4096
CHECKPOINT=checkpoints.sqlite3
DATABASE_URL=sqlite:///checkpoints.sqlite3
```

## Development Commands

### Environment Management
```bash
# Initialize .bashrc settings (required in new tabs)
source /home/bittu/.bashrc

# Create/activate virtual environment (using UV per user rules)
uv venv
source .venv/bin/activate

# Install dependencies
uv pip install -e .
```

### Running the Application
```bash
# Start the interactive agent CLI
uv run python main.py

# Alternative direct execution
python main.py
```

### Development Tasks
```bash
# Run Jupyter notebook for exploration
uv run jupyter notebook

# View dependency lock file
cat uv.lock

# Check Python version
python --version
```

## Agent Capabilities

The agent is designed with sophisticated planning and reflection capabilities:

### Core Functions
- **Intelligent Code Analysis**: Parse and understand code structure, identify gaps
- **Strategic Planning**: Generate step-by-step execution plans for code transformation
- **Reflection System**: Continuous monitoring and progress tracking
- **Code Enhancement**: Complete partial implementations, add error handling
- **Testing Framework**: Create comprehensive test suites and validation
- **Sandboxed Execution**: Deploy enhanced code in isolated environments

### Interaction Patterns
- Type `quit` or `exit` to terminate
- Ctrl+C for interruption (can continue conversation)
- Conversational interface with persistent memory via SQLite checkpoints

## File Structure Context

```
autotest/
├── agent/                 # Core agent implementation
│   ├── agent.py          # Main agent builder and logic
│   ├── memory.py         # Checkpoint/conversation memory
│   ├── prompts.py        # System prompts and capabilities
│   └── schemas.py        # Type definitions
├── configs/              # Configuration management
│   └── settings.py       # Pydantic settings with env support
├── main.py              # CLI entry point
├── pyproject.toml       # Project dependencies and metadata
├── .env                 # Environment variables (local)
├── .python-version      # Python version specification
└── uv.lock             # UV dependency lock file
```

## Key Dependencies

### AI/ML Framework Stack
- **langchain**: Core LLM framework and abstractions
- **langgraph**: State machine and agent orchestration  
- **langchain-groq**: Groq API integration for fast inference
- **langchain-mcp-adapters**: Model Context Protocol client

### Persistence & Data
- **aiosqlite**: Async SQLite for checkpoints and memory
- **langgraph-checkpoint-sqlite**: LangGraph SQLite checkpoint implementation

### Development Tools
- **jupyter**: Notebook environment for exploration and testing
- **pyppeteer**: Browser automation capabilities
- **fastmcp**: Fast MCP server implementation
- **httpx**: HTTP client for API interactions

## Agent Workflow

1. **Initialization**: Agent builds with Groq model and MCP tools
2. **Input Processing**: User messages added to AgentState schema
3. **Planning Phase**: Agent analyzes requirements and creates execution plan
4. **Tool Execution**: MCP tools invoked based on plan requirements  
5. **Reflection**: Continuous monitoring and plan adjustment
6. **Response Generation**: AI message returned to user
7. **State Persistence**: Conversation saved to SQLite checkpoint

## Development Notes

- The system uses thread-based conversation management with `thread_id: "local-cli"`
- MCP tools are accessed via HTTP transport on localhost:8000
- Agent supports both synchronous and asynchronous operations
- Extensive error handling with graceful degradation
- Memory persistence allows resuming conversations across sessions
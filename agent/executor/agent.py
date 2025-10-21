from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, ToolMessage
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import InMemorySaver
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

from agent.executor.schemas import ExecutorState
from agent.executor.prompts import executor_prompt
from agent.executor.tools import client
from agent.models import groq_llm, local_llm as _model
from agent.hooks.pre_model_hook import (
    SummaryState,
    summarization_node,
)  # pre_model_hook


def add_supervisor_message(state: ExecutorState, supervisor_text: str) -> ExecutorState:
    state["messages"].append(AIMessage(content=supervisor_text))
    return state


async def executor():
    _executor_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", executor_prompt),
            MessagesPlaceholder(variable_name="messages"),
        ]
    )

    tools = await client.get_tools()

    model = _model.bind_tools(tools=tools)
    checkpointer = InMemorySaver()
    code_executor = create_react_agent(
        name="executor_agent",
        model=model,
        tools=tools,
        checkpointer=checkpointer,
        prompt=_executor_prompt,
        pre_model_hook=summarization_node,
        state_schema=SummaryState,
    )

    return code_executor

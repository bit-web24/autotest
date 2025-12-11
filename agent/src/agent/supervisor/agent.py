import asyncio

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_groq import ChatGroq
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver
from langgraph_supervisor import create_supervisor
from pydantic import SecretStr

from agent.coder.agent import coder
from agent.executor.agent import executor

# from agent.models import local_llm as _model
from agent.models import groq_llm as _model
from agent.planner.agent import planner
from agent.settings import settings
from agent.supervisor.hooks.pre_model_hook import (
    SummaryState,
    summarization_node,
)  # pre_model_hook
from agent.supervisor.memory import get_checkpointer
from agent.supervisor.prompts import supervisor_prompt
from agent.supervisor.schemas import AgentState
from agent.supervisor.tools import client


def add_user_message(state: AgentState, user_text: str) -> AgentState:
    state["messages"].append(HumanMessage(content=user_text))
    return state


async def build_agent():
    planner_agent, coder_agent, executor_agent = await asyncio.gather(
        planner(), coder(), executor()
    )

    _supervisor_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", supervisor_prompt),
            MessagesPlaceholder(variable_name="messages"),
        ]
    )

    model = _model
    workflow = create_supervisor(
        supervisor_name="workflow_manager",
        model=model,
        agents=[planner_agent, coder_agent, executor_agent],
        tools=[],
        prompt=_supervisor_prompt,
        add_handoff_messages=True,
        add_handoff_back_messages=True,
        pre_model_hook=summarization_node,
        state_schema=SummaryState,
    )
    memory = await get_checkpointer()
    return workflow.compile(checkpointer=memory)

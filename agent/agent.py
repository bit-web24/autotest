import asyncio

from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_groq import ChatGroq
from pydantic import SecretStr
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph_supervisor import create_supervisor

from agent.schemas import AgentState
from configs.settings import settings
from agent.prompts import supervisor_prompt
from agent.planner.agent import planner
from agent.coder.agent import coder
from agent.executor.agent import executor
from agent.tools import client
from agent.models import local_llm, groq_llm


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

    model = local_llm
    workflow = create_supervisor(
        supervisor_name="workflow_manager",
        model=model,
        agents=[planner_agent, coder_agent, executor_agent],
        prompt=_supervisor_prompt,
    )

    return workflow.compile()

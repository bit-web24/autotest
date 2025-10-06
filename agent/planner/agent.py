from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import InMemorySaver
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

from agent.models import groq_llm
from agent.planner.schemas import PlannerState
from agent.planner.prompts import planner_prompt
from agent.planner.tools import client
from .hooks.pre_model_hook import pre_model_hook


def add_supervisor_message(state: PlannerState, supervisor_text: str) -> PlannerState:
    state["messages"].append(HumanMessage(content=supervisor_text))
    return state


async def planner():
    _planner_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", planner_prompt),
            MessagesPlaceholder(variable_name="messages"),
        ]
    )

    tools = await client.get_tools()
    model = groq_llm.bind_tools(tools=tools)
    checkpointer = InMemorySaver()
    task_planner = create_react_agent(
        name="planner_agent",
        model=model,
        tools=tools,
        checkpointer=checkpointer,
        prompt=_planner_prompt,
        # pre_model_hook=pre_model_hook,
    )

    return task_planner

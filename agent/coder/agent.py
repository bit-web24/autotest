from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, ToolMessage
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import InMemorySaver
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

from agent.coder.schemas import CoderState
from agent.coder.prompts import coder_prompt
from agent.coder.tools import client
from agent.models import groq_llm


def add_supervisor_message(state: CoderState, supervisor_text: str) -> CoderState:
    state["messages"].append(AIMessage(content=supervisor_text))
    return state


async def coder():
    _coder_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", coder_prompt()),
            MessagesPlaceholder(variable_name="messages"),
        ]
    )

    tools = await client.get_tools()

    model = groq_llm.bind_tools(tools=tools)
    checkpointer = InMemorySaver()
    _coder = create_react_agent(
        name="coder_agent",
        model=model,
        tools=tools,
        checkpointer=checkpointer,
        prompt=_coder_prompt,
    )

    return _coder

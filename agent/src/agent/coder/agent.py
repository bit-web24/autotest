from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, ToolMessage
from langgraph.graph import END, START, StateGraph
from langgraph.prebuilt import ToolNode, create_react_agent
from langgraph.checkpoint.memory import InMemorySaver
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

from agent.coder.schemas import CoderState
from agent.coder.prompts import coder_prompt
from agent.coder.tools import client

# from agent.models import local_llm as _model
from agent.models import groq_llm as _model

from agent.coder.hooks.pre_model_hook import summarization_node, SummaryState


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

    model = _model.bind_tools(tools=tools)
    checkpointer = InMemorySaver()
    _coder = create_react_agent(
        name="coder_agent",
        model=model,
        tools=tools,
        checkpointer=checkpointer,
        prompt=_coder_prompt,
        pre_model_hook=summarization_node,
        state_schema=SummaryState,
    )

    return _coder


# Custom Coder Agent Implementation
# async def coder():
#     tools = await client.get_tools()
#     model = groq_llm.bind_tools(tools=tools)
#     checkpointer = InMemorySaver()

#     async def call_model(state: CoderState) -> CoderState:
#         messages = state["messages"]
#         response = await model.ainvoke(
#             [SystemMessage(content=coder_prompt())] + messages
#         )
#         state["messages"].append(response)

#         # Detect stop signal (FINISHED / DONE)
#         if "FINISHED:" in response.content or "DONE" in response.content:
#             state["is_done"] = True

#         return state

#     def route_next(state: CoderState):
#         """
#         Determine what to do next after the LLM response.
#         """
#         if state.get("is_done"):
#             return END

#         last_message = state["messages"][-1]
#         has_tool_call = hasattr(last_message, "tool_calls") and last_message.tool_calls

#         if has_tool_call:
#             return "tools"
#         else:
#             return "llm"

#     graph = StateGraph(CoderState)
#     graph.add_node("llm", call_model)
#     graph.add_node("tools", ToolNode(tools))

#     graph.set_entry_point("llm")
#     graph.add_conditional_edges(
#         "llm", route_next, {"tools": "tools", "llm": "llm", END: END}
#     )
#     graph.add_edge("tools", "llm")

#     return graph.compile(name="coder_agent", checkpointer=checkpointer)

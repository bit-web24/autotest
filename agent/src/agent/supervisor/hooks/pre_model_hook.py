from langchain_core.messages.utils import count_tokens_approximately, trim_messages
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage, ToolMessage
from agent.supervisor.schemas import AgentState
from langmem.short_term import SummarizationNode

# from agent.models import groq_llm as _model
from agent.models import local_llm as _model
from typing import Any

# This function will be added as a new node in ReAct agent graph
# that will run every time before the node that calls the LLM.
# The messages returned by this function will be the input to the LLM.
# def pre_model_hook(state: AgentState):
#     trimmed_messages = trim_messages(
#         state["messages"],
#         strategy="last",
#         token_counter=count_tokens_approximately,
#         max_tokens=1500,
#         start_on="human",
#         end_on=("human", "tool"),
#         include_system=True,
#     )
#     return {"llm_input_messages": trimmed_messages}


class SummaryState(AgentState):
    # NOTE: we're adding this key to keep track of previous summary information
    # to make sure we're not summarizing on every LLM call
    context: dict[str, Any]
    remaining_steps: int


# This function will be called every time before the node that calls LLM
summarization_node = SummarizationNode(
    token_counter=count_tokens_approximately,
    model=_model,
    max_tokens=4000,
    max_summary_tokens=400,
    output_messages_key="messages",
)


# # Summarization configuration
# RECENT_MESSAGES_TO_KEEP = 5


# async def summarize_messages(
#     messages: list[HumanMessage | AIMessage | ToolMessage | SystemMessage], llm
# ) -> str:
#     """
#     Summarize a list of messages into a concise summary.

#     Args:
#         messages: List of messages to summarize
#         llm: Language model to use for summarization

#     Returns:
#         Summary string
#     """
#     # Filter out system messages from summarization
#     messages_to_summarize = [
#         msg for msg in messages if not isinstance(msg, SystemMessage)
#     ]

#     if not messages_to_summarize:
#         return "No previous conversation."

#     # Create context string from messages
#     context = []
#     for msg in messages_to_summarize:
#         if isinstance(msg, HumanMessage):
#             context.append(f"User: {msg.content}")
#         elif isinstance(msg, AIMessage):
#             if hasattr(msg, "tool_calls") and msg.tool_calls:
#                 context.append(
#                     f"Assistant: [Called tools: {', '.join([tc['name'] for tc in msg.tool_calls])}]"
#                 )
#             else:
#                 context.append(f"Assistant: {msg.content}")
#         elif isinstance(msg, ToolMessage):
#             context.append(f"Tool ({msg.name}): {msg.content[:100]}...")

#     conversation_text = "\n".join(context)

#     # Create summarization prompt
#     summary_prompt = f"""Summarize the following conversation concisely, preserving key information, decisions, and context:

# {conversation_text}

# Provide a brief summary that captures the essential points:"""

#     # Get summary from LLM
#     response = await llm.ainvoke([HumanMessage(content=summary_prompt)])
#     return response.content


# async def summarization_node(state: CoderState) -> CoderState:
#     """
#     Pre-model hook that keeps recent N messages and summarizes the rest.

#     Args:
#         state: Current coder state

#     Returns:
#         Updated state with summarized messages
#     """
#     messages = state.get("messages", [])

#     # If we have fewer messages than the threshold, no summarization needed
#     if len(messages) <= RECENT_MESSAGES_TO_KEEP:
#         return state

#     # Separate system messages, old messages, and recent messages
#     system_messages = [msg for msg in messages if isinstance(msg, SystemMessage)]
#     non_system_messages = [
#         msg for msg in messages if not isinstance(msg, SystemMessage)
#     ]

#     # Split into old and recent
#     if len(non_system_messages) <= RECENT_MESSAGES_TO_KEEP:
#         return state

#     old_messages = non_system_messages[:-RECENT_MESSAGES_TO_KEEP]
#     recent_messages = non_system_messages[-RECENT_MESSAGES_TO_KEEP:]

#     # Generate summary of old messages
#     summary_text = await summarize_messages(old_messages, model)

#     # Create new message list with summary
#     summary_message = SystemMessage(
#         content=f"[CONVERSATION SUMMARY]\n{summary_text}\n[END SUMMARY]\n\nThe following are the {RECENT_MESSAGES_TO_KEEP} most recent messages:"
#     )

#     # Reconstruct messages: system messages + summary + recent messages
#     new_messages = system_messages + [summary_message] + recent_messages

#     state["messages"] = new_messages
#     return state

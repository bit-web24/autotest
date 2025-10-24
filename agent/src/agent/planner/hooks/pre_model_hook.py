from langchain_core.messages.utils import count_tokens_approximately, trim_messages
from agent.planner.schemas import PlannerState
from langmem.short_term import SummarizationNode
from agent.models import local_llm as _model
from typing import Any

# This function will be added as a new node in ReAct agent graph
# that will run every time before the node that calls the LLM.
# The messages returned by this function will be the input to the LLM.
# def pre_model_hook(state: PlannerState):
#     trimmed_messages = trim_messages(
#         state["messages"],
#         strategy="last",
#         token_counter=count_tokens_approximately,
#         max_tokens=1000,
#         start_on="human",
#         end_on=("human", "tool"),
#         include_system=True,
#     )
#     return {"llm_input_messages": trimmed_messages}


class SummaryState(PlannerState):
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

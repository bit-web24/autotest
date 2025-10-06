from langchain_core.messages.utils import count_tokens_approximately, trim_messages
from agent.executor.schemas import ExecutorState


# This function will be added as a new node in ReAct agent graph
# that will run every time before the node that calls the LLM.
# The messages returned by this function will be the input to the LLM.
def pre_model_hook(state: ExecutorState):
    trimmed_messages = trim_messages(
        state["messages"],
        strategy="last",
        token_counter=count_tokens_approximately,
        max_tokens=1000,
        start_on="human",
        end_on=("human", "tool"),
        include_system=True,
    )
    return {"llm_input_messages": trimmed_messages}

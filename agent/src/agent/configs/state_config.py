from langchain_core.runnables import RunnableConfig


def state_config(chat_id: str = "S2706406N1910241200174"):
    return RunnableConfig(recursion_limit=1000, configurable={"thread_id": chat_id})

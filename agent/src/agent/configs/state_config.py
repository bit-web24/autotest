from langchain_core.runnables import RunnableConfig


def state_config(chat_id: str):
    return RunnableConfig(recursion_limit=1000, configurable={"thread_id": chat_id})

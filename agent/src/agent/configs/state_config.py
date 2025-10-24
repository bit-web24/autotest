from langchain_core.runnables import RunnableConfig

state_config = RunnableConfig(
    recursion_limit=1000, configurable={"thread_id": "local-cli"}
)

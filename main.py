import asyncio
from typing import cast

from langchain_core.messages import AIMessage, HumanMessage

from agent.schemas import AgentState
from agent.prompts import summarizer_prompt
from agent.agent import build_agent
from configs.state_config import state_config

print("""Welcome to AutoTest Agent;\n""")


def add_user_message(state: AgentState, user_input: str) -> AgentState:
    """Add user message to state properly"""
    human_msg = HumanMessage(content=user_input)
    # The add_messages annotation will handle appending properly
    return AgentState(messages=state["messages"] + [human_msg])


def summarize_and_maintain_context(
    state: AgentState, model, max_messages: int = 3
) -> AgentState:
    """Summarize old messages while maintaining recent context"""
    messages = state["messages"]

    # If we don't have too many messages, return as is
    if len(messages) <= max_messages:
        return state

    # Keep the last few messages for context
    recent_messages = messages[-max_messages:]
    old_messages = messages[:-max_messages]

    # Create summary of old messages
    old_conversation = "\n".join(
        [
            f"{'Human' if isinstance(msg, HumanMessage) else 'AI'}: {msg.content}"
            for msg in old_messages
        ]
    )

    summarized = model.invoke(input=summarizer_prompt(old_conversation))

    # Create new state with summary + recent messages
    summary_message = AIMessage(
        content=f"[Previous conversation summary]: {summarized.content}"
    )
    new_messages = [summary_message] + recent_messages

    return AgentState(messages=new_messages)


async def main():
    state: AgentState = AgentState(messages=[])

    agent_x = await build_agent()

    while True:
        try:
            user = input("\nyou> ").strip()
            if not user:
                continue
            if user.lower() in ["exit", "quit"]:
                print("\nbye!")
                exit(-1)

            # Add user message properly
            state = add_user_message(state, user)

            # Stream the response incrementally (messages + events)
            print("\nagent> ", end="", flush=True)

            async for event in agent_x.astream_events(
                state,
                config=state_config,
                version="v1",
            ):
                # print("EVENT: ", event)
                etype = event["event"]

                # --- Streaming tokens from the LLM ---
                if etype == "on_chat_model_stream":
                    delta = event["data"]["chunk"].content
                    if delta:  # skip empty chunks
                        print(delta, end="", flush=True)

                # --- Full message finished ---
                elif etype == "on_chat_model_end":
                    print()  # newline at the end of message

                # --- Supervisor/agent actions ---
                elif etype == "on_chain_start":
                    print(f"\n[event] Node '{event['name']}' started")

                elif etype == "on_chain_end":
                    print(f"\n[event] Node '{event['name']}' finished")

                elif etype == "on_tool_start":
                    tool_input = event["data"].get("input")
                    print(
                        f"\n[event] Tool called: {event['name']} with input {tool_input}"
                    )

                elif etype == "on_tool_end":
                    tool_output = event["data"].get("output")
                    print(f"\n[event] Tool '{event['name']}' finished → {tool_output}")

        except KeyboardInterrupt:
            print("\nInterrupted. Type 'quit' to exit.")
        except Exception as e:
            print(f"\nError: {e}")
            # Optionally, you might want to continue rather than crash
            continue


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:
        print(f"Fatal error: {e}")

import asyncio
from typing import cast

from langchain_core.messages import HumanMessage

from agent.supervisor.schemas import AgentState
from agent.supervisor.agent import build_agent
from agent.configs.state_config import state_config

print("""Welcome to AutoTest Agent;\n""")


def add_user_message(state: AgentState, user_input: str) -> AgentState:
    """Add user message to state properly"""
    human_msg = HumanMessage(content=user_input)
    return AgentState(messages=state["messages"] + [human_msg])


async def main():
    """Main function to run the agent"""
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
                etype = event["event"]

                if etype == "on_chat_model_stream":
                    delta = event["data"]["chunk"].content
                    if delta:
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
            print(f"\nError: {e.args}")
            continue


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:
        print(f"Fatal error: {e}")

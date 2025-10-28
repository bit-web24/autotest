from typing import TypedDict
from typing import AsyncGenerator
import json

from agent.supervisor.schemas import AgentState
from agent.configs import state_config

from langchain_core.runnables.schema import StreamEvent
from langchain_core.messages import HumanMessage


class EventService:
    def __init__(self, agent):
        self.agent = agent

    def _add_user_message(self, state: AgentState, user_input: str) -> AgentState:
        """Add user message to state properly."""
        human_msg = HumanMessage(content=user_input)
        return AgentState(messages=state["messages"] + [human_msg])

    async def stream_events(
        self, chat_id: str, user_input: str
    ) -> AsyncGenerator[str, None]:
        """
        Stream incremental events (tokens, tools, etc.) for a given chat_id and input.
        """
        try:
            # Load chat state (TODO: get from DB or memory)
            state: AgentState = AgentState(messages=[])

            # Add user message
            state = self._add_user_message(state, user_input)

            async for event in self.agent.astream_events(
                state,
                config=state_config,
                version="v1",
            ):
                etype = event["event"]

                if etype == "on_chat_model_stream":
                    delta = event["data"]["chunk"].content
                    if delta:
                        print(
                            f"data: {json.dumps({'type': 'token', 'delta': delta})}\n\n"
                        )
                        yield f"data: {json.dumps({'type': 'token', 'delta': delta})}\n\n"

                elif etype == "on_chat_model_end":
                    yield f"data: {json.dumps({'type': 'message_end'})}\n\n"

                elif etype == "on_chain_start":
                    yield f"data: {json.dumps({'type': 'chain_start', 'node': event['name']})}\n\n"

                elif etype == "on_chain_end":
                    yield f"data: {json.dumps({'type': 'chain_end', 'node': event['name']})}\n\n"

                elif etype == "on_tool_start":
                    tool_input = event["data"].get("input")
                    yield f"data: {json.dumps({'type': 'tool_start', 'name': event['name'], 'input': tool_input})}\n\n"

                elif etype == "on_tool_end":
                    tool_output = event["data"].get("output")
                    yield f"data: {json.dumps({'type': 'tool_end', 'name': event['name'], 'output': tool_output})}\n\n"

            # End of stream
            yield "event: done\ndata: [END]\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    # async def get_events(self, chat_id: str) -> list[dict]:
    #     """
    #     Optionally retrieve stored/past events if your agent supports it.
    #     """
    #     return await self.agent.get_event_log(chat_id)

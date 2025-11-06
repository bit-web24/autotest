import json
from typing import AsyncGenerator, TypedDict

from agent.configs.state_config import state_config
from agent.supervisor.schemas import AgentState
from langchain_core.messages import HumanMessage

from server.models.event import Event


class EventService:
    def __init__(self, agent):
        self.agent = agent

    def _add_user_message(self, state: AgentState, user_input: str) -> AgentState:
        """Add user message to state properly."""
        human_msg = HumanMessage(content=user_input)
        return AgentState(messages=state["messages"] + [human_msg])

    def sse_start(self):
        return "event: begin\ndata: [START]\n\n"

    def sse_response(self, stream_event: Event):
        return (
            f"event: chunk\ndata: {stream_event.model_dump_json(exclude_none=True)}\n\n"
        )

    def sse_err(self, error: Exception):
        err = {
            "message": str(error),
        }
        return f"event: error\ndata: {json.dumps(err)}\n\n"

    def sse_end(self):
        return "event: done\ndata: [END]\n\n"

    def on_chat_model_start(self, event) -> str:
        custom_event = Event(
            name=event["event"],
        )

        if not custom_event.payload:
            custom_event.payload = dict()

        custom_event.payload["thread_id"] = event["metadata"]["thread_id"]
        return self.sse_response(custom_event)

    def on_chat_model_stream(self, event) -> str:
        chunk = event["data"]["chunk"]
        reasoning = chunk.additional_kwargs
        custom_event = Event(
            name=event["event"],
        )
        if not custom_event.payload:
            custom_event.payload = dict()

        custom_event.payload["thread_id"] = event["metadata"]["thread_id"]

        if reasoning:
            custom_event.payload["reasoning"] = True
            custom_event.payload["chunk"] = reasoning["reasoning_content"]
        else:
            custom_event.payload["reasoning"] = False
            custom_event.payload["chunk"] = chunk.content

        return self.sse_response(custom_event)

    def on_chat_model_end(self, event) -> str:
        custom_event = Event(
            name=event["event"],
        )

        if not custom_event.payload:
            custom_event.payload = dict()

        message = event["data"]["output"]["generations"][0][0]["message"]
        output = message.content
        reasoning = message.additional_kwargs["reasoning_content"]
        thread_id = event["metadata"]["thread_id"]
        usage_metadata = message.usage_metadata

        custom_event.payload = {
            "thread_id": thread_id,
            "reasoning_content": reasoning,
            "output": output,
            "usage_metadata": usage_metadata,
        }

        return self.sse_response(custom_event)

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

            # Start of stream
            yield self.sse_start()

            async for event in self.agent.astream_events(
                state,
                config=state_config(chat_id),
                version="v1",
            ):
                event_type = event["event"]

                match event_type:
                    # case "on_chain_start":
                    #     pass
                    case "on_chat_model_start":
                        yield self.on_chat_model_start(event)
                    case "on_chat_model_stream":
                        yield self.on_chat_model_stream(event)
                    case "on_chat_model_end":
                        yield self.on_chat_model_end(event)
                    # case "on_chain_end":
                    #     pass
                    # case _:
                    #    yield f"data: {event}\n\n"

            # End of stream
            yield self.sse_end()
        except Exception as e:
            yield self.sse_err(e)

    # async def get_events(self, chat_id: str) -> list[dict]:
    #     """
    #     Optionally retrieve stored/past events if your agent supports it.
    #     """
    #     return await self.agent.get_event_log(chat_id)

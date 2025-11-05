from agent.supervisor.agent import build_agent
from server.services.events_service import EventService


class Agent:
    def __init__(self, name):
        self.name = name
        self.agent = None
        self.event_service: EventService | None = None

    async def start(self):
        try:
            self.agent = await build_agent()
            self.event_service = EventService(self.agent)
        except Exception as e:
            print(f"Failed to initialize agent: {e}")
        finally:
            print(f"Agent initialized: {self.name}")

    async def get_event_service(self):
        return self.event_service


agent = Agent("Autotest")

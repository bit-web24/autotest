from server.schemas.chat import Message, Chat


class ChatService:
    def __init__(self) -> None:
        pass

    async def create(self, name: str) -> str:
        pass

    async def get(self, chat_id: str) -> str:
        pass

    async def gets(self) -> list[Chat] | None:
        return None

    async def update(self, chat_id: str, name: str) -> str:
        pass

    async def delete(self, chat_id: str) -> None:
        pass

    async def add_message(self, chat_id: str, message: Message) -> None:
        pass

    async def get_messages(self, chat_id: str, limit: int) -> list[Message] | None:
        return None

    async def get_message(self, chat_id: str, message_id: str) -> Message | None:
        return None

    async def update_message(
        self, chat_id: str, message_id: str, message: Message
    ) -> None:
        pass

    async def delete_message(self, chat_id: str, message_id: str) -> None:
        pass

    # def add_message(self, user_id: str, chat_id: str, message: str) -> None:
    #         pass

import uuid
from datetime import datetime
from server.models.chat import Message, Chat, ChatCreate
from typing import Any
from motor.motor_asyncio import AsyncIOMotorDatabase, AsyncIOMotorCollection


class ChatService:
    def __init__(self, db: AsyncIOMotorDatabase[dict[str, Any]]) -> None:
        self.collection: AsyncIOMotorCollection[dict[str, Any]] = db.chats

    async def create(self, chat: ChatCreate) -> Chat | None:
        _chat = Chat(
            **chat.model_dump(),
            _id=str(uuid.uuid4()),
            messages=[],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        result = await self.collection.insert_one(chat.model_dump())
        return _chat if result.acknowledged else None

    async def get(self, chat_id: str) -> Chat | None:
        chat = await self.collection.find_one({"_id": chat_id})
        if chat:
            return Chat(**chat)
        return None

    async def gets(self) -> list[Chat] | None:
        chats = await self.collection.find().to_list(None)
        return [Chat(**chat) for chat in chats] if chats else None

    async def update(self, chat_id: str, name: str) -> Chat | None:
        pass

    async def delete(self, chat_id: str) -> None:
        pass

    async def add_message(self, chat_id: str, message: Message) -> Message | None:
        pass

    async def get_messages(
        self, chat_id: str, limit: int | None
    ) -> list[Message] | None:
        return None

    async def get_message(self, chat_id: str, message_id: str) -> Message | None:
        return None

    async def update_message(
        self, chat_id: str, message_id: str, message: Message
    ) -> Message | None:
        pass

    async def delete_message(self, chat_id: str, message_id: str) -> None:
        pass

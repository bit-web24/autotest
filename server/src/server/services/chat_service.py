import uuid
from typing import Any
from datetime import datetime

from server.models.chat import Message, Chat, ChatCreate, ChatUpdate

from motor.motor_asyncio import AsyncIOMotorDatabase, AsyncIOMotorCollection


class ChatService:
    def __init__(self, db: AsyncIOMotorDatabase[dict[str, Any]]) -> None:
        self.collection: AsyncIOMotorCollection[dict[str, Any]] = db.chats

    async def create(self, chat: ChatCreate) -> Chat | None:
        chat_dict = {
            "_id": str(uuid.uuid4()),
            "name": chat.name,
            "messages": [],
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
        }

        result = await self.collection.insert_one(chat_dict)

        if result.acknowledged:
            return Chat(**chat_dict)
        return None

    async def get(self, chat_id: str) -> Chat | None:
        chat = await self.collection.find_one({"_id": chat_id})
        if chat:
            return Chat(**chat)
        return None

    async def gets(self) -> list[Chat]:
        chats = await self.collection.find().to_list(None)
        return [Chat(**chat) for chat in chats] if chats else []

    async def update(self, chat_id: str, chat: ChatUpdate) -> Chat | None:
        result = await self.collection.update_one(
            {"_id": chat_id},
            {
                "$set": {
                    "name": chat.name,
                    "updated_at": datetime.now(),
                }
            },
        )
        if result.modified_count > 0:
            return await self.get(chat_id)
        return None

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

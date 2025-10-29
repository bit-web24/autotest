import uuid
from typing import Any
from datetime import datetime

from server.models.chat import Message, Chat, ChatCreate, ChatUpdate

from motor.motor_asyncio import AsyncIOMotorDatabase, AsyncIOMotorCollection


class ChatService:
    def __init__(self, db: AsyncIOMotorDatabase[dict[str, Any]]) -> None:
        self.collection: AsyncIOMotorCollection[dict[str, Any]] = db.chats
        self.msg_collection: AsyncIOMotorCollection[dict[str, Any]] = db.messages

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

    async def gets(self) -> list[Chat] | None:
        try:
            chats = await self.collection.find().to_list(None)
            return [Chat(**chat) for chat in chats] if chats else []
        except Exception:
            return None

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

    async def delete(self, chat_id: str) -> int | None:
        """Delete a chat by ID.

        Args:
            chat_id (str): The ID of the chat to delete.

        Returns:
            int | None: The number of deleted documents, or None if the chat was not found.
        """
        result = await self.collection.delete_one({"_id": chat_id})
        if result.acknowledged and result.deleted_count > 0:
            return await self.delete_messages(chat_id)
        return None

    async def add_message(self, chat_id: str, message: Message) -> Message | None:
        msg_dict = {
            "_id": str(uuid.uuid4()),
            "request": message.request,
            "response": message.response,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
        }
        insert_result = await self.msg_collection.insert_one(msg_dict)
        if insert_result.acknowledged and insert_result.inserted_id is not None:
            update_result = await self.collection.update_one(
                {"_id": chat_id},
                {
                    "$push": {
                        "messages": str(insert_result.inserted_id),
                    },
                    "$set": {"updated_at": datetime.now()},
                },
            )
            if update_result.acknowledged and update_result.modified_count > 0:
                return message
        return None

    async def get_messages(
        self, chat_id: str, limit: int | None
    ) -> list[Message] | None:
        try:
            messages = await self.msg_collection.find({"chat_id": chat_id}).to_list(
                limit
            )
            return [Message(**msg) for msg in messages]
        except Exception:
            return None

    async def get_message(self, chat_id: str, message_id: str) -> Message | None:
        result = await self.msg_collection.find_one(
            {"chat_id": chat_id, "_id": message_id}
        )
        if result is None:
            return None
        return Message(**result)

    async def update_message(
        self, chat_id: str, message_id: str, message: Message
    ) -> Message | None:
        result = await self.msg_collection.update_one(
            {"chat_id": chat_id, "_id": message_id},
            {"$set": message.model_dump(exclude_unset=True)},
        )
        if result.acknowledged and result.modified_count > 0:
            return await self.get_message(chat_id, message_id)

    async def delete_message(self, chat_id: str, message_id: str) -> int | None:
        """Delete a message from a chat.

        Args:
            chat_id (str): The ID of the chat to delete the message from.
            message_id (str): The ID of the message to delete.

        Returns:
            int | None: The number of deleted documents, or None if the chat was not found.
        """
        result = await self.msg_collection.delete_one(
            {"chat_id": chat_id, "_id": message_id}
        )
        if result.acknowledged and result.deleted_count > 0:
            return result.deleted_count
        return None

    async def delete_messages(self, chat_id: str) -> int | None:
        """Delete all messages in a chat.

        Args:
            chat_id (str): The ID of the chat to delete messages from.

        Returns:
            int | None: The number of deleted documents, or None if the chat was not found.
        """
        result = await self.msg_collection.delete_many({"chat_id": chat_id})
        if result.acknowledged and result.deleted_count > 0:
            return result.deleted_count
        return None

from typing import Any
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from server.config import settings
from pydantic import BaseModel, ConfigDict


class MongoDB(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    client: AsyncIOMotorClient[dict[str, Any]] | None = None


mongodb = MongoDB()


async def connect_to_mongodb():
    """Create database connection"""
    mongodb.client = AsyncIOMotorClient(settings.DATABASE_URL)
    print(f"Connected to MongoDB at {settings.DATABASE_URL}")


async def close_mongodb_connection():
    """Close database connection"""
    if mongodb.client is None:
        print("Could not close MongoDB connection. [Database was not initialized]")
        return None
    mongodb.client.close()
    print("Closed MongoDB connection")


def get_database() -> AsyncIOMotorDatabase[dict[str, Any]] | None:
    """Get database instance"""
    if mongodb.client is None:
        print("Database was not initialized")
        return None
    return mongodb.client[settings.DATABASE_NAME]

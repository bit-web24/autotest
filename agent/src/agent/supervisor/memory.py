import os

import aiosqlite
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver

from agent.settings import settings

# Global checkpointer instance
_CHECKPOINTER = None


async def get_checkpointer():
    """
    Get or create the checkpoint saver instance
    """
    global _CHECKPOINTER
    if _CHECKPOINTER is None:
        CHECKPOINT_PATH = os.path.join(settings.CHECKPOINT_DIR, settings.CHECKPOINT)
        os.makedirs(settings.CHECKPOINT_DIR, exist_ok=True)
        conn = await aiosqlite.connect(CHECKPOINT_PATH, check_same_thread=False)
        _CHECKPOINTER = AsyncSqliteSaver(conn)
    return _CHECKPOINTER


async def delete_chat_thread(thread_id: str):
    """
    Delete a specific thread from the checkpoint store
    """

    checkpointer = await get_checkpointer()

    try:
        await checkpointer.adelete_thread(thread_id)
        print(f"✅ Deleted thread: {thread_id}")
        return True
    except Exception as e:
        print(f"❌ Error deleting thread {thread_id}: {e}")
        return False

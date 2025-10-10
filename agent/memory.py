import aiosqlite
from settings import settings


# Checkpoint store for graph (conversation memory)
async def checkpoint_connection():
    return aiosqlite.connect(settings.CHECKPOINT, check_same_thread=False)

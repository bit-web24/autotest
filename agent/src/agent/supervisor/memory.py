import os

import aiosqlite

from agent.settings import settings


# Checkpoint store for graph (conversation memory)
async def checkpoint_connection():
    CHECKPOINT_PATH = os.path.join(settings.CHECKPOINT_DIR, settings.CHECKPOINT)
    os.makedirs(settings.CHECKPOINT_DIR, exist_ok=True)
    return aiosqlite.connect(CHECKPOINT_PATH, check_same_thread=False)

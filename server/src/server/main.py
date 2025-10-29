from contextlib import asynccontextmanager

from agent.supervisor.agent import build_agent
from server.api.v1.router import api_router
from server.config import settings
from server.core.database import connect_to_mongodb, close_mongodb_connection
from server.services.events_service import EventService

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    agent = await build_agent()
    print(f"Agent initialized: {agent.name}")
    app.state.event_service = EventService(agent)
    print(f"Event service initialized: {app.state.event_service.agent.name}")
    await connect_to_mongodb()
    yield
    await close_mongodb_connection()
    # await app.state.event_service.close()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
async def root():
    return {"message": "Welcome to Autotest[SERVER];", "version": settings.VERSION}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.api.v1.router import api_router
from server.api.v1.endpoints.events import lifespan
from server.config import settings
import uvicorn
from agent.supervisor.agent import build_agent

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


uvicorn.run(app, host="0.0.0.0", port=8000)

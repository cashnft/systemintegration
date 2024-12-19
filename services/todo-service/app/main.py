from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.endpoints import todos
from .core.config import settings
from .db.base import Base
from .db.session import engine

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    todos.router,
    prefix=f"{settings.API_V1_STR}/todos",
    tags=["todos"]
)
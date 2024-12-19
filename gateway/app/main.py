# gateway/app/main.py
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
from typing import Any
import os
from prometheus_fastapi_instrumentator import Instrumentator
import time

app = FastAPI(title="API Gateway")

# Add metrics instrumentation
Instrumentator().instrument(app).expose(app)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service URLs
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8000")
TODO_SERVICE_URL = os.getenv("TODO_SERVICE_URL", "http://todo-service:8000")

@app.middleware("http")
async def add_response_time(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

@app.api_route("/auth/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def auth_proxy(path: str, request: Request):
    """Proxy requests to auth service"""
    client = httpx.AsyncClient(base_url=AUTH_SERVICE_URL)
    try:
        url = f"{request.url.path.replace('/auth/', '/')}"
        headers = {k: v for k, v in request.headers.items() if k.lower() not in ('host', 'content-length')}
        body = await request.body()
        
        response = await client.request(
            method=request.method,
            url=url,
            content=body,
            headers=headers,
        )
        
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await client.aclose()

@app.api_route("/todos/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def todo_proxy(path: str, request: Request):
    """Proxy requests to todo service"""
    client = httpx.AsyncClient(base_url=TODO_SERVICE_URL)
    try:
        url = f"{request.url.path.replace('/todos/', '/')}"
        headers = {k: v for k, v in request.headers.items() if k.lower() not in ('host', 'content-length')}
        body = await request.body()
        
        response = await client.request(
            method=request.method,
            url=url,
            content=body,
            headers=headers,
        )
        
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await client.aclose()

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
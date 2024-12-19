import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.db.session import get_db


@pytest.fixture
def client():
    return TestClient(app)

def test_register_user(client):
    """Test user registration"""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"

def test_login(client):
    """Test user login"""
    # First register a user
    client.post(
        "/api/v1/auth/register",
        json={
            "username": "logintest",
            "email": "login@test.com",
            "password": "testpass123"
        }
    )

    # Then try to login
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "logintest",
            "password": "testpass123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_invalid_login(client):
    """Test login with wrong credentials"""
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "nonexistent",
            "password": "wrongpass"
        }
    )
    assert response.status_code == 401


@pytest.fixture
def test_db():
   
    from app.db.base import Base
    from app.db.session import engine
    Base.metadata.create_all(bind=engine)
    yield

    Base.metadata.drop_all(bind=engine)
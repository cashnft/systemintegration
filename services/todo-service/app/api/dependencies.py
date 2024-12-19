from fastapi import Depends, Header
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from typing import Optional
import httpx
from ..core.config import settings
from ..core.exceptions import CREDENTIALS_EXCEPTION

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.AUTH_SERVICE_URL}/api/auth/login")

async def get_current_user_id(token: str = Depends(oauth2_scheme)) -> str:
    try:
        payload = jwt.decode(token, options={"verify_signature": False})
        username: str = payload.get("sub")
        if username is None:
            raise CREDENTIALS_EXCEPTION
        return username
    except jwt.JWTError:
        raise CREDENTIALS_EXCEPTION
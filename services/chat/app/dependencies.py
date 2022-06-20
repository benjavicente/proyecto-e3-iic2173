from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlmodel import Session

from app.auth import validate_token

from .db import engine

token_auth_scheme = HTTPBearer()


def get_user_token(token: HTTPAuthorizationCredentials = Depends(token_auth_scheme)):
    ok, data = validate_token(token.credentials)
    if ok:
        return data
    raise HTTPException(status_code=401, detail="Invalid token")


def get_db_session():
    with Session(engine) as session:
        yield session
        session.commit()

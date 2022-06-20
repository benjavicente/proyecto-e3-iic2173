from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlmodel import Session

from app.auth import JWTValidationError, validate_token

from .db import engine

token_auth_scheme = HTTPBearer()


def get_user_token(token: HTTPAuthorizationCredentials = Depends(token_auth_scheme)):
    try:
        return validate_token(token.credentials)
    except JWTValidationError:
        raise HTTPException(status_code=401, detail="Invalid token") from None


def get_db_session():
    with Session(engine) as session:
        yield session
        session.commit()

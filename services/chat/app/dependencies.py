import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlmodel import Session

from .config import config
from .db import engine
from .models.users import UserToken

token_auth_scheme = HTTPBearer()
jwks_client = jwt.PyJWKClient(f"https://{config.auth0_domain}/.well-known/jwks.json")


def get_user_token(token: HTTPAuthorizationCredentials = Depends(token_auth_scheme)) -> UserToken:
    try:
        jwk = jwks_client.get_signing_key_from_jwt(token.credentials)
    except (jwt.exceptions.DecodeError, jwt.exceptions.PyJWKClientError) as error:
        raise HTTPException(status_code=401, detail=str(error))

    try:
        data = jwt.decode(
            token.credentials,
            jwk.key,
            algorithms=[config.auth0_algorithms],
            audience="http://localhost:8030",  # config.auth0_api_audience,
            issuer="https://dev-7c2520d3.us.auth0.com/",  # config.auth0_issuer,
        )
    except jwt.InvalidTokenError as error:
        raise HTTPException(status_code=401, detail=str(error))

    return UserToken.parse_obj(data)


def get_db_session():
    with Session(engine) as session:
        yield session
        session.commit()

import jwt
from fastapi import Depends, Response
from fastapi.security import HTTPBearer
from .config import config

token_auth_scheme = HTTPBearer()
jwks_client = jwt.PyJWKClient(f"https://{config.auth0_domain}/.well-known/jwks.json")


def get_user_token(token: str = Depends(token_auth_scheme)):
    try:
        jwk = jwks_client.get_signing_key_from_jwt(token)
    except (jwt.DecodeError, jwt.PyJWKClientError) as error:
        return Response(status_code=401, content=error)

    try:
        data = jwt.decode(
            token,
            jwk.key,
            algorithms=[config.auth0_algorithms],
            audience=config.auth0_api_audience,
            issuer=config.auth0_issuer,
        )
    except jwt.InvalidTokenError as error:
        return Response(status_code=401, content=error)

    # TODO: transform data to User object (user it is the sub claim)
    return data

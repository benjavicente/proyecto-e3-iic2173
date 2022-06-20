import jwt

from .config import config
from .models.users import UserToken

jwks_client = jwt.PyJWKClient(f"https://{config.auth0_domain}/.well-known/jwks.json")


def validate_token(token: str):
    try:
        jwk = jwks_client.get_signing_key_from_jwt(token)
    except (jwt.exceptions.DecodeError, jwt.exceptions.PyJWKClientError) as error:
        return False, str(error)

    try:
        data = jwt.decode(
            token,
            jwk.key,
            algorithms=[config.auth0_algorithms],
            audience="http://localhost:8030",  # config.auth0_api_audience,
            issuer="https://dev-7c2520d3.us.auth0.com/",  # config.auth0_issuer,
        )
    except jwt.InvalidTokenError as error:
        return False, str(error)

    return True, UserToken.parse_obj(data)

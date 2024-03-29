import jwt

from .config import config
from .models.users import UserToken


class JWTValidationError(Exception):
    """Raised when a validation error occurs."""

    def __init__(self, error: str):
        self.error = error


jwks_client = jwt.PyJWKClient(f"https://{config.auth0_domain}/.well-known/jwks.json")


def validate_token(token: str):
    try:
        jwk = jwks_client.get_signing_key_from_jwt(token)
    except (jwt.exceptions.DecodeError, jwt.exceptions.PyJWKClientError) as error:
        raise JWTValidationError(error=str(error)) from None

    try:
        
        data = jwt.decode(
            token,
            jwk.key,
            algorithms=[config.auth0_algorithms],
            audience=config.auth0_api_audience,
            issuer=config.auth0_issuer,
        )
    except jwt.InvalidTokenError as error:
        raise JWTValidationError(error=str(error)) from None
    # Se agrega un atributo para luego poder recuperar el email del mismo token
    data['email']= data['https://email']

    return UserToken.parse_obj(data)

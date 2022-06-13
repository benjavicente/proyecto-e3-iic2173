from typing import Union
from pydantic import BaseSettings


class Config(BaseSettings):
    auth0_domain: str = ""  # your.domain.auth0.com
    auth0_api_audience: Union[str, None] = None  # your.api.audience
    auth0_algorithms: str = "RS256"
    auth0_issuer: str = ""  # https://your.domain.auth0.com/
    database_url: str = ""  # postgresql://user:password@host:port/dbname


config = Config()

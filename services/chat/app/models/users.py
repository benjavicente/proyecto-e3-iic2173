from datetime import datetime

from pydantic import BaseModel, Field


class UserToken(BaseModel):
    issuer: str = Field(..., alias="iss", description="Issuer of the token")
    audience: str = Field(..., alias="aud", description="Audience of the token")
    user_id: str = Field(..., alias="sub", description="User ID of the token")
    issued_at: datetime = Field(..., alias="iat", description="Issued at")
    expires_at: datetime = Field(..., alias="exp", description="Expires at")
    authorized_party: str = Field(..., alias="azp", description="Authorized party")

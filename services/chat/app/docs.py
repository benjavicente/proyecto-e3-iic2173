import re
from functools import wraps
from pathlib import Path
from urllib.parse import scheme_chars

from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

from .models.messages import PrivateMessageInput, PublicMessageInput


def custom_openapi(app: FastAPI):
    "Adds adicional info to the OpenAPI document"

    @wraps(app.openapi)
    def wrapped():
        markdown = Path(__file__).parents[1].joinpath("readme.md").read_text()
        description = re.sub(r"^#[^#]+?\n", "", markdown, flags=re.MULTILINE)
        openapi_schema = get_openapi(
            title="Chat",
            version="0.1.0",
            description=description,
            routes=app.routes,
        )

        schemas_to_add = PublicMessageInput, PrivateMessageInput
        for schema in schemas_to_add:
            openapi_schema["components"]["schemas"][schema.__name__] = schema.schema()

        return openapi_schema

    return wrapped

from dataclasses import dataclass, field
from typing import Any

from fastapi import WebSocket


class WSException(Exception):
    def __init__(self, message: str):
        self.message = message


@dataclass(frozen=True)
class ConnectionManager:
    connections: dict[str, WebSocket] = field(default_factory=dict)

    async def listen(self, user_id: str, websocket: WebSocket):
        "Connects a websocket and yields json messages received from it"
        self.connections[user_id] = websocket
        error = "???"
        try:
            while True:
                data: dict[str, Any] = await websocket.receive_json()
                await websocket.send_json({"status": "ok", "data": data})
                yield data
        except WSException as ws_exception:
            error = ws_exception.message
        finally:
            await websocket.send_json({"error": error})
            self.connections.pop(user_id)

from dataclasses import dataclass, field
from typing import Any

from fastapi import WebSocket


@dataclass(frozen=True)
class ConnectionManager:
    connections: dict[str, WebSocket] = field(default_factory=dict)

    async def listen(self, user_id: str, websocket: WebSocket):
        "Connects a websocket and yields json messages received from it"
        await websocket.accept()
        self.connections[user_id] = websocket
        try:
            while True:
                data: dict[str, Any] = await websocket.receive_json()
                yield data
        finally:
            self.connections.pop(user_id)

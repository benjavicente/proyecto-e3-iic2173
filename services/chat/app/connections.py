from dataclasses import dataclass, field
from typing import Any

from starlette.websockets import WebSocket, WebSocketState


class WSException(Exception):
    def __init__(self, message: str):
        self.message = message


@dataclass(frozen=True)
class ConnectionManager:
    async def listen(self, websocket: WebSocket):
        "Connects a websocket and yields json messages received from it"
        error = "???"
        try:
            while True:
                data: dict[str, Any] = await websocket.receive_json()
                await websocket.send_json({"status": "ok", "data": data})
                yield data
        except WSException as ws_exception:
            error = ws_exception.message
        finally:
            if websocket.state == WebSocketState.CONNECTED:
                await websocket.send_json({"error": error})
                await websocket.close()

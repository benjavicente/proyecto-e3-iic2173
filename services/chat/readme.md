
# Chat 💬

FastAPI + SQLModel chat service. It uses:

- Websocket for real-time communication
- Persisten message history with REST API
- Auth0 for user identification and authorization
- Independent Postgres database to persist messages

> [See this post](https://testdriven.io/blog/fastapi-sqlmodel/)


## WebSockets

There is a single WebSocket for real-time communication.
The endpoint is `/chat/ws`. It can recive as input a:

- `PrivateMessageInput`
- `PublicMessageInput`

And it will send to the client, depending on the type of message, a:

- `PrivateMessage`
- `PublicMessage`

See the schema below of the autogenerated docs.
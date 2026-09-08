# ascii

Self-hosted FIGlet / ASCII art generator. Web app + API + MCP server + CLI.

## Deploy (docker compose)

1. Copy `.env.example` to `.env` and set `ADMIN_TOKEN`, and optionally `UMAMI_*`.
2. `docker compose up -d`.
3. Point nginx-proxy-manager at `ascii.johansen.foo`:
   - `/` → `web:3000`
   - `/mcp` → `mcp:3200`
4. Open `https://ascii.johansen.foo`.

## CLI

Download a binary from the latest release and add to `~/.zshrc`:

    ascii "hello" --font Big
    ascii --list
    ascii "hello" --animate --color
    ascii "hello" --remote https://ascii.johansen.foo

## MCP

Connect your MCP client to `https://ascii.johansen.foo/mcp`.

## Development

    npm install
    npm run dev          # web app
    npm test             # unit tests
    make fonts           # regenerate font manifest + sync to CLI

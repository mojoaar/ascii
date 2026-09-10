# ascii

Self-hosted FIGlet / ASCII art generator. Web app + API + MCP server + CLI.

## Deploy (docker compose)

1. Copy `.env.example` to `.env` and set `ADMIN_TOKEN`, and optionally `UMAMI_*` and `APP_URL`.
2. `docker compose up -d`. Compose pulls the images from `ghcr.io/mojoaar/ascii` and `ghcr.io/mojoaar/ascii-mcp`.
3. Point nginx-proxy-manager at `ascii.johansen.foo`:
   - `/` → `web:3000`
   - `/mcp` → `mcp:3200`
4. Open `https://ascii.johansen.foo`.

See <https://ascii.johansen.foo/docs> for full installation instructions, CLI downloads, and environment variables.

## CLI

Download a binary from the latest release and add to `~/.zshrc`:

    ascii "hello" --font Big
    ascii --list
    ascii "hello" --animate --color
    ascii "hello" --remote https://ascii.johansen.foo

Note: `--layout` only affects `--remote` mode (the local renderer does not implement FIGlet smushing).

## MCP

Connect your MCP client to `https://ascii.johansen.foo/mcp`.

## Development

    npm install
    npm run dev          # web app
    npm test             # unit tests
    make fonts           # regenerate font manifest + sync to CLI

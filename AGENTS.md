# AGENTS.md

Self-hosted FIGlet / ASCII art generator. Monorepo, npm workspaces.

## Stack
- Node >= 22, npm only (no pnpm/yarn). Go 1.27 (apps/cli only).
- Next.js 16 (App Router), TypeScript strict, React 19, better-sqlite3.
- No Tailwind/shadcn, no ESLint/Prettier, no next-themes/next-intl/commander/yargs/oclif — hand-rolled.

## Layout
- packages/core — pure TS engine (generate, listFonts/getFont, animate, toAnsi)
- apps/web — Next.js app + SQLite DB + REST API
- apps/mcp — MCP server (streamable HTTP)
- apps/cli — Go CLI (go:embed fonts)
- data/fonts — canonical .flf and .tlf fonts + fonts.json attribution manifest (single source of truth)

## Commands
- npm run dev / build
- npm run lint          # tsc --noEmit across workspaces (this IS the linter)
- npm test
- npm run coverage --workspace @ascii/web   # 80/80/80/70 thresholds
- cd apps/cli && go test ./... && go vet ./...
- make fonts            # regen manifest + copy fonts into apps/cli/fonts (before go build)
- make cli              # build CLI binaries

## Conventions
- Lint is tsc --noEmit only. No ESLint/Prettier.
- Path alias @/* → apps/web root.
- API routes: export const dynamic = 'force-dynamic'; errors {error, code} via lib/api.ts apiError(); rate limit via getRateLimiter + applyRateLimitHeaders (x-ratelimit-* headers); structured console.error(JSON.stringify(...)).
- CSP/nonce lives in proxy.ts (NOT middleware.ts), injected via x-nonce request header.
- Theming: data-theme + data-mode on <html>, CSS vars in globals.css (6 palettes × dark/light).
- i18n: hand-rolled; messages/en.ts (MessageKey = keyof typeof en) + da.ts (Record<MessageKey,string>).
- Components: functional + default export; client components start 'use client'.
- Tests co-located *.test.ts.
- Fonts always carry attribution (author/source/license/copyright).
- Conventional commits: lowercase type(scope): subject after every task.
- Version: apps/web/package.json version is the single source (footer reads it). Keep CHANGELOG.md (Keep-a-Changelog); semver tags vX.Y.Z.

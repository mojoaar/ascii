# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Live all-fonts wall on the home page (replaces single-font picker)
- Per-font copy buttons with "Copied!" feedback
- View popup for full-width ASCII art
- Light/dark mode toggle button and `D` keyboard shortcut
- `F` shortcut to focus the font filter; `Esc` clears the focused filter
- Footer with version link and attribution
- `AGENTS.md` project conventions and MIT `LICENSE`
- TOIlet `.tlf` font support in core, web API, Go CLI, and font curation
- 24 canonical TOIlet fonts from xero/figlet-fonts (ascii12, ascii9, bigascii12, bigascii9, bigmono12, bigmono9, circle, emboss, emboss2, future, letter, mono12, mono9, pagga, rebel, rusto, rustofat, smascii12, smascii9, smblock, smbraille, smmono12, smmono9, wideterm)
- 2 modern block-character fonts (phm-blocky-reverse, phm-rounded)

### Changed
- Curated the font set: removed 19 low-quality classic fonts
- Widened site layout to 1600px for larger screens
- Loaded JetBrains Mono via `next/font/google` so the monospace stack actually ships
- Renamed home header from "ASCII art generator" to "ASCII Generator"

### Removed
- 13 PhMajerus fonts dropped — they use Unicode Symbols-for-Legacy-Computing characters unsupported in browsers and terminals

### Fixed
- Changed main input focus shortcut from `/` to `I` so it works on international keyboards where `/` requires Shift
- Admin page shows a friendly disabled message instead of a 404 when `ADMIN_TOKEN` is unset
- Theme-init script uses `next/script` to silence React 19 dev warning
- Copy button underline removed; button placed above the preview to avoid overlapping art
- Generated art no longer contains trailing whitespace or blank lines
- CLI `--width` wrapping miscounted Unicode block glyphs (byte vs. rune length)
- Font curation left stale files in the CLI font directory after removals

## [0.1.0] - 2026-09-09

### Added
- FIGlet ASCII art generator with a live all-fonts wall
- REST API (`/api/generate`, `/api/generate-all`, `/api/animate`, `/api/fonts`, `/api/health`)
- MCP server (streamable HTTP) with `generate_ascii`, `list_fonts`, `preview_font`, and `animate` tools
- Go CLI with embedded fonts and local rendering
- Admin dashboard with stats and settings
- Docs page, fonts gallery, i18n (English/Danish), theming (6 palettes × dark/light), keyboard shortcuts
- Umami tracking and a hardened Docker Compose deployment

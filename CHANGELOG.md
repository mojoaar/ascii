# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- 15 modern block-character fonts (PhMajerus/FIGfonts)

### Changed
- Curated the font set: removed 19 low-quality classic fonts

### Fixed
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

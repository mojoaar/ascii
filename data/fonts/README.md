# Fonts

Canonical FIGlet font data for the ASCII app. `.flf` files are the glyph data;
`fonts.json` is the generated attribution manifest (author / source / license /
copyright), produced by `make fonts` (runs `scripts/curate-fonts.mjs`).

Do not edit `fonts.json` by hand. To add a font, drop a licensed `.flf` here and
run `make fonts`.

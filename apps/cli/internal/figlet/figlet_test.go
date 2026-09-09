package figlet

import (
	"strings"
	"testing"
)

// buildFont constructs a minimal valid FIGfont (height 3, no comment lines)
// with a known 'A' glyph and a space glyph using the hardblank '$'.
func buildFont() string {
	var b strings.Builder
	b.WriteString("flf2a$ 3 2 4 8 0 0 0 0\n")
	for code := 32; code <= 126; code++ {
		rows := []string{"", "", ""}
		switch code {
		case ' ':
			rows = []string{"$", "$", "$"}
		case 'A':
			rows = []string{" _ ", "/ \\", "|_|"}
		case 'H':
			rows = []string{"| |", "|-|", "| |"}
		case 'I':
			rows = []string{" _ ", " | ", " | "}
		}
		for _, r := range rows {
			b.WriteString(r)
			b.WriteString("@\n")
		}
	}
	return b.String()
}

func TestParseHeader(t *testing.T) {
	f, err := Parse(buildFont())
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	if f.Height != 3 {
		t.Fatalf("height = %d, want 3", f.Height)
	}
	if f.Hardblank != '$' {
		t.Fatalf("hardblank = %q, want '$'", f.Hardblank)
	}
}

func TestRender(t *testing.T) {
	f, err := Parse(buildFont())
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	out := f.Render("A", 0)
	want := " _ \n/ \\\n|_|"
	if out != want {
		t.Fatalf("render = %q, want %q", out, want)
	}
}

func TestRenderSpaceUsesHardblank(t *testing.T) {
	f, err := Parse(buildFont())
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	out := f.Render("A A", 0)
	want := " _   _ \n/ \\ / \\\n|_| |_|"
	if out != want {
		t.Fatalf("render = %q, want %q", out, want)
	}
}

func TestRenderWidthWrap(t *testing.T) {
	f, err := Parse(buildFont())
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	out := f.Render("HI", 3)
	lines := strings.Split(out, "\n")
	// Two whole-glyph blocks ("H" then "I"), each f.Height(3) lines.
	if len(lines) != 6 {
		t.Fatalf("wrapped render produced %d lines, want 6\n%s", len(lines), out)
	}
	for _, l := range lines {
		if len(l) > 3 {
			t.Fatalf("line %q exceeds maxWidth 3", l)
		}
	}
}

func TestRenderWidthWrapNoSplit(t *testing.T) {
	f, err := Parse(buildFont())
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	// A single glyph wider than maxWidth is kept whole (never split).
	out := f.Render("H", 1)
	lines := strings.Split(out, "\n")
	if len(lines) != 3 {
		t.Fatalf("render produced %d lines, want 3\n%s", len(lines), out)
	}
	if lines[0] != "| |" {
		t.Fatalf("glyph was split: %q", out)
	}
}

func TestGlyphWidthCountsRunes(t *testing.T) {
	// "▀" is 3 bytes but 1 rune; glyphWidth must count runes, not bytes.
	rows := []string{"▀▀▀", "▀", ""}
	if w := glyphWidth(rows); w != 3 {
		t.Fatalf("glyphWidth = %d, want 3", w)
	}
}

func TestRenderUnicodeBlockGlyph(t *testing.T) {
	// A block-char font: 'A' renders as a single-column "▀" glyph.
	var b strings.Builder
	b.WriteString("flf2a$ 3 2 4 8 0 0 0 0\n")
	for code := 32; code <= 126; code++ {
		rows := []string{"", "", ""}
		switch code {
		case ' ':
			rows = []string{"$", "$", "$"}
		case 'A':
			rows = []string{"▀", "▀", "▀"}
		}
		for _, r := range rows {
			b.WriteString(r)
			b.WriteString("@\n")
		}
	}
	f, err := Parse(b.String())
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	out := f.Render("A", 0)
	want := "▀\n▀\n▀"
	if out != want {
		t.Fatalf("render = %q, want %q", out, want)
	}
	// Two 1-column glyphs at maxWidth 1 → wraps into 2 blocks of 3 lines each.
	wrapped := f.Render("AA", 1)
	if got := len(strings.Split(wrapped, "\n")); got != 6 {
		t.Fatalf("wrapped lines = %d, want 6\n%s", got, wrapped)
	}
}

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

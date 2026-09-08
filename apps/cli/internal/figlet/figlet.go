package figlet

import (
	"errors"
	"strings"
)

// Font holds parsed .flf glyph data.
type Font struct {
	Hardblank byte
	Height    int
	Glyphs    map[rune][]string
}

// Parse reads standard .flf content.
//
// The first line carries the signature and all layout numbers:
//
//	flf2a<hardblank> <height> <baseline> <maxLength> <oldLayout>
//	                 <commentLines> <printDirection> <fullLayout> <codetagCount>
//
// followed by <commentLines> comment lines, then 95 glyphs (codes 32..126),
// each <height> rows terminated by one or two '@' endmarks.
func Parse(content string) (*Font, error) {
	lines := strings.Split(content, "\n")
	if len(lines) == 0 {
		return nil, errors.New("empty font")
	}
	header := lines[0]
	if len(header) < 6 || header[:5] != "flf2a" {
		return nil, errors.New("not a flf2a font")
	}
	f := &Font{Hardblank: header[5], Glyphs: map[rune][]string{}}

	toks := strings.Fields(header[6:])
	if len(toks) < 1 {
		return nil, errors.New("missing height")
	}
	f.Height = atoi(toks[0])
	commentLines := 0
	if len(toks) > 4 {
		commentLines = atoi(toks[4])
	}

	idx := 1 + commentLines
	for code := 32; code <= 126; code++ {
		glyph := make([]string, f.Height)
		for row := 0; row < f.Height; row++ {
			if idx >= len(lines) {
				glyph[row] = ""
				idx++
				continue
			}
			line := strings.TrimSuffix(lines[idx], "\r")
			idx++
			// Strip the endmark(s): one '@' always, a second '@' signals a
			// trailing hardblank (smush).
			if len(line) > 0 && line[len(line)-1] == '@' {
				line = line[:len(line)-1]
				if len(line) > 0 && line[len(line)-1] == '@' {
					line = line[:len(line)-1]
				}
			}
			glyph[row] = strings.ReplaceAll(line, string(f.Hardblank), " ")
		}
		f.Glyphs[rune(code)] = glyph
	}
	return f, nil
}

// Render renders text with the font. When maxWidth > 0, output is wrapped so
// that no line exceeds maxWidth characters, breaking between whole glyphs
// (a glyph is never split mid-column). Behaviour is unchanged when maxWidth is 0.
func (f *Font) Render(text string, maxWidth int) string {
	glyphs := make([][]string, 0, len(text))
	for _, r := range text {
		g, ok := f.Glyphs[r]
		if !ok {
			g = f.Glyphs['?']
		}
		glyphs = append(glyphs, g)
	}

	if maxWidth <= 0 {
		return f.join(glyphs)
	}

	var lines [][][]string
	var cur [][]string
	curW := 0
	for _, g := range glyphs {
		w := glyphWidth(g)
		if len(cur) > 0 && curW+w > maxWidth {
			lines = append(lines, cur)
			cur = nil
			curW = 0
		}
		cur = append(cur, g)
		curW += w
	}
	if len(cur) > 0 {
		lines = append(lines, cur)
	}

	var blocks []string
	for _, ln := range lines {
		blocks = append(blocks, f.join(ln))
	}
	if len(blocks) == 0 {
		return ""
	}
	return strings.Join(blocks, "\n")
}

// join renders a list of glyphs into height lines.
func (f *Font) join(glyphs [][]string) string {
	out := make([]string, f.Height)
	for _, g := range glyphs {
		for i := 0; i < f.Height; i++ {
			if i < len(g) {
				out[i] += g[i]
			}
		}
	}
	return strings.Join(out, "\n")
}

func glyphWidth(g []string) int {
	w := 0
	for _, row := range g {
		if len(row) > w {
			w = len(row)
		}
	}
	return w
}

func atoi(s string) int {
	n := 0
	for _, c := range s {
		if c < '0' || c > '9' {
			break
		}
		n = n*10 + int(c-'0')
	}
	return n
}

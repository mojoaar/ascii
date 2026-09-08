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
func Parse(content string) (*Font, error) {
	lines := strings.Split(content, "\n")
	header := lines[0]
	if len(header) < 6 || header[:5] != "flf2a" {
		return nil, errors.New("not a flf2a font")
	}
	f := &Font{Hardblank: header[5], Glyphs: map[rune][]string{}}
	// parse height from header line 2 (header comment lines end before the number line)
	idx := 1
	for idx < len(lines) && !isNumLine(lines[idx]) {
		idx++
	}
	if idx >= len(lines) {
		return nil, errors.New("missing height line")
	}
	// height is the first token; baseline is second; comment count next
	toks := strings.Fields(lines[idx])
	if len(toks) == 0 {
		return nil, errors.New("empty height line")
	}
	f.Height = atoi(toks[0])
	commentLines := 0
	if len(toks) > 1 {
		commentLines = atoi(toks[1])
	}
	idx += 1 + commentLines
	// now read 95 printable ASCII glyphs (space..~)
	for code := 32; code <= 126; code++ {
		if idx+1 >= len(lines) {
			break
		}
		glyph := make([]string, f.Height)
		for row := 0; row < f.Height; row++ {
			if idx >= len(lines) {
				glyph[row] = ""
				continue
			}
			line := lines[idx]
			if strings.HasSuffix(line, "\r") {
				line = line[:len(line)-1]
			}
			// strip the two end-of-line marker chars (last char is terminator '@')
			if len(line) > 0 && line[len(line)-1] == '@' {
				line = line[:len(line)-1]
			}
			if len(line) > 0 {
				line = line[:len(line)-1]
			}
			glyph[row] = strings.ReplaceAll(line, string(f.Hardblank), " ")
			idx++
		}
		f.Glyphs[rune(code)] = glyph
	}
	return f, nil
}

// Render renders text with the font.
func (f *Font) Render(text string, maxWidth int) string {
	var out []string
	for i := 0; i < f.Height; i++ {
		out = append(out, "")
	}
	for _, r := range text {
		g, ok := f.Glyphs[r]
		if !ok {
			g = f.Glyphs['?']
		}
		for i := 0; i < f.Height; i++ {
			if i < len(g) {
				out[i] += g[i]
			}
		}
	}
	return strings.Join(out, "\n")
}

func isNumLine(s string) bool {
	if len(s) == 0 {
		return false
	}
	c := s[0]
	return c >= '0' && c <= '9'
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

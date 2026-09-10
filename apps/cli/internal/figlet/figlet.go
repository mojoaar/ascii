package figlet

import (
	"errors"
	"strings"
	"unicode/utf8"
)

type horizontalLayout int

const (
	layoutFull horizontalLayout = iota
	layoutFitted
	layoutControlledSmushing
	layoutUniversalSmushing
)

// Font holds parsed .flf glyph data.
type Font struct {
	Hardblank byte
	Height    int
	Layout    horizontalLayout
	Glyphs    map[rune][]string
}

// Parse reads standard .flf or .tlf content.
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
	if len(header) < 6 || (header[:5] != "flf2a" && header[:5] != "tlf2a") {
		return nil, errors.New("not a figlet/toilet font")
	}
	f := &Font{Hardblank: header[5], Layout: layoutFitted, Glyphs: map[rune][]string{}}

	toks := strings.Fields(header[6:])
	if len(toks) < 1 {
		return nil, errors.New("missing height")
	}
	f.Height = atoi(toks[0])
	commentLines := 0
	if len(toks) > 4 {
		commentLines = atoi(toks[4])
	}
	if len(toks) > 3 {
		oldLayout := atoi(toks[3])
		f.Layout = parseHorizontalLayout(oldLayout, 0)
	}
	if len(toks) > 6 {
		fullLayout := atoi(toks[6])
		f.Layout = resolveFullLayout(f.Layout, fullLayout)
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

// join renders a list of glyphs into height lines with kerning/smushing.
func (f *Font) join(glyphs [][]string) string {
	if len(glyphs) == 0 {
		return ""
	}
	out := padRows(glyphs[0], f.Height)
	for _, g := range glyphs[1:] {
		out = horizontalSmush(out, padRows(g, f.Height), f.Layout)
	}
	return strings.Join(out, "\n")
}

func padRows(g []string, h int) []string {
	rows := make([]string, h)
	for i := 0; i < h; i++ {
		if i < len(g) {
			rows[i] = g[i]
		}
	}
	w := glyphWidth(rows)
	for i := range rows {
		n := utf8.RuneCountInString(rows[i])
		if n < w {
			rows[i] += strings.Repeat(" ", w-n)
		}
	}
	return rows
}

func trimTrailingSpace(rows []string) []string {
	out := make([]string, len(rows))
	for i, r := range rows {
		out[i] = strings.TrimRightFunc(r, func(r rune) bool { return r == ' ' })
	}
	return out
}

func horizontalSmush(left, right []string, layout horizontalLayout) []string {
	if layout == layoutFull {
		out := make([]string, len(left))
		for i := range left {
			out[i] = left[i] + right[i]
		}
		return out
	}
	w := len(left[0])
	maxOverlap := w
	if wr := len(right[0]); wr > maxOverlap {
		maxOverlap = wr
	}
	overlap := maxOverlap

distLoop:
	for d := 1; d <= maxOverlap; d++ {
		if canOverlap(left, right, d, layout) {
			continue
		}
		overlap = d - 1
		break distLoop
	}
	out := make([]string, len(left))
	for i := range left {
		l := left[i]
		r := right[i]
		prefixLen := w - overlap
		if prefixLen < 0 {
			prefixLen = 0
		}
		prefix := ""
		if prefixLen < len(l) {
			prefix = l[:prefixLen]
		} else {
			prefix = l
		}
		mid := overlap
		if mid > len(r) {
			mid = len(r)
		}
		suffix := ""
		if mid < len(r) {
			suffix = r[mid:]
		}
		piece := mergeOverlap(l, r, w, overlap, layout)
		out[i] = prefix + piece + suffix
	}
	return out
}

func canOverlap(left, right []string, dist int, layout horizontalLayout) bool {
	w := len(left[0])
	start := w - dist
	for i := range left {
		l := left[i]
		r := right[i]
		for col := 0; col < dist; col++ {
			lidx := start + col
			if lidx < 0 || lidx >= len(l) {
				continue
			}
			if lidx < 0 || lidx >= len(l) || col < 0 || col >= len(r) {
				continue
			}
			lc := l[lidx]
			rc := r[col]
			if lc != ' ' && rc != ' ' {
				return layout != layoutFitted
			}
		}
	}
	return true
}

func mergeOverlap(left, right string, leftW, overlap int, layout horizontalLayout) string {
	start := leftW - overlap
	var b strings.Builder
	b.Grow(overlap)
	for col := 0; col < overlap; col++ {
		lidx := start + col
		if lidx < 0 || lidx >= len(left) {
			b.WriteByte(right[col])
			continue
		}
		if col < 0 || col >= len(right) {
			b.WriteByte(left[lidx])
			continue
		}
		lc := left[lidx]
		rc := right[col]
		if lc == ' ' && rc == ' ' {
			b.WriteByte(' ')
		} else if lc == ' ' {
			b.WriteByte(rc)
		} else if rc == ' ' {
			b.WriteByte(lc)
		} else if layout == layoutFitted {
			// In strict fitting mode overlapping characters should never occur
			// because canOverlap rejects them; keep the left character.
			b.WriteByte(lc)
		} else {
			b.WriteByte(universalSmush(lc, rc))
		}
	}
	return b.String()
}

func universalSmush(a, b byte) byte {
	if a == b {
		return a
	}
	// Mirror-like pairs collapse; otherwise prefer the left character.
	pair := string([]byte{a, b})
	switch pair {
	case "[]", "][":
		return '|'
	case "{", "}":
		return '|'
	case "()", ")()":
		return '|'
	case "<>", "><":
		return 'X'
	case "/\\", "\\/":
		return '|'
	}
	return a
}

func resolveFullLayout(current horizontalLayout, fullLayout int) horizontalLayout {
	if fullLayout == 0 {
		return current
	}
	if fullLayout&64 == 64 {
		return layoutFull
	}
	if fullLayout&32 == 32 {
		return layoutUniversalSmushing
	}
	if fullLayout&31 != 0 {
		return layoutFitted
	}
	return current
}

func parseHorizontalLayout(oldLayout, fullLayout int) horizontalLayout {
	// Full layout bit (64) forces full-width joining.
	if fullLayout != 0 && fullLayout&64 == 64 {
		return layoutFull
	}
	// Universal smushing bit (32) forces overlapping character pairs to smush.
	if fullLayout != 0 && fullLayout&32 == 32 {
		return layoutUniversalSmushing
	}
	// Controlled smushing numbers are not implemented yet; fall back to the
	// safer fitted kerning used by the web renderer.
	if fullLayout != 0 && fullLayout&31 != 0 {
		return layoutFitted
	}
	if oldLayout == 0 {
		return layoutFitted
	}
	if oldLayout == -1 {
		return layoutFull
	}
	// Controlled smushing via oldLayout semantics also falls back to fitted.
	return layoutFitted
}

func glyphWidth(g []string) int {
	w := 0
	for _, row := range g {
		if n := utf8.RuneCountInString(row); n > w {
			w = n
		}
	}
	return w
}

func atoi(s string) int {
	sign := 1
	start := 0
	if len(s) > 0 && s[0] == '-' {
		sign = -1
		start = 1
	}
	n := 0
	for _, c := range s[start:] {
		if c < '0' || c > '9' {
			break
		}
		n = n*10 + int(c-'0')
	}
	return sign * n
}

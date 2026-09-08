package render

import "strings"

// Ansi wraps each line in true-color green.
func Ansi(text string) string {
	lines := strings.Split(text, "\n")
	var b strings.Builder
	for _, l := range lines {
		b.WriteString("\x1b[38;2;51;255;102m")
		b.WriteString(l)
		b.WriteString("\x1b[0m\n")
	}
	return b.String()
}

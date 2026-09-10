package main

import (
	"flag"
	"fmt"
	"os"
	"strings"

	"github.com/mojoaar/ascii/cli/fonts"
	"github.com/mojoaar/ascii/cli/internal/client"
	"github.com/mojoaar/ascii/cli/internal/figlet"
	"github.com/mojoaar/ascii/cli/internal/render"
)

var safeReplacer = strings.NewReplacer("'", "_", "\"", "_", "`", "_", "\\", "_")

func cliSafeName(s string) string { return safeReplacer.Replace(s) }

func main() {
	font := flag.String("f", "Standard", "font name")
	fontAlias := flag.String("font", "", "font name (long)")
	list := flag.Bool("list", false, "list available fonts")
	width := flag.Int("width", 0, "max width")
	layout := flag.String("layout", "default", "horizontal layout")
	animate := flag.Bool("animate", false, "reveal animation")
	color := flag.Bool("color", true, "colorize output (ANSI)")
	noColor := flag.Bool("no-color", false, "disable color")
	remote := flag.String("remote", "", "remote API base URL")

	// The stdlib flag package stops at the first positional argument, so
	// "ascii hi --no-color" would treat "--no-color" as text. Parse flags
	// interspersed with positionals by re-running Parse after each positional.
	var args []string
	rest := os.Args[1:]
	for {
		if err := flag.CommandLine.Parse(rest); err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(2)
		}
		if flag.NArg() == 0 {
			break
		}
		args = append(args, flag.Arg(0))
		rest = flag.Args()[1:]
	}

	if *fontAlias != "" {
		*font = *fontAlias
	}

	if *list {
		listFonts()
		return
	}

	text := strings.Join(args, " ")
	if text == "" {
		fmt.Fprintln(os.Stderr, "usage: ascii [flags] TEXT")
		os.Exit(1)
	}

	var out string
	var err error
	if *remote != "" {
		out, err = client.Generate(*remote, text, *font, *width)
	} else {
		out, err = localRender(text, *font, *width)
	}
	if err != nil {
		fmt.Fprintln(os.Stderr, "error:", err)
		os.Exit(1)
	}

	if *animate {
		lines := strings.Split(out, "\n")
		for i := 1; i <= len(lines); i++ {
			fmt.Print("\033[2J\033[H")
			fmt.Println(strings.Join(lines[:i], "\n"))
		}
		return
	}

	if *color && !*noColor {
		fmt.Print(render.Ansi(out))
	} else {
		fmt.Println(out)
	}
	_ = layout
}

func localRender(text, name string, maxWidth int) (string, error) {
	base := cliSafeName(name)
	content, err := fonts.FS.ReadFile(base + ".flf")
	if err != nil {
		content, err = fonts.FS.ReadFile(base + ".tlf")
	}
	if err != nil {
		return "", fmt.Errorf("font %q not found", name)
	}
	f, err := figlet.Parse(string(content))
	if err != nil {
		return "", err
	}
	return f.Render(text, maxWidth), nil
}

func listFonts() {
	entries, _ := fonts.FS.ReadDir(".")
	for _, e := range entries {
		n := e.Name()
		if strings.HasSuffix(n, ".flf") || strings.HasSuffix(n, ".tlf") {
			fmt.Println(strings.TrimSuffix(strings.TrimSuffix(n, ".flf"), ".tlf"))
		}
	}
}

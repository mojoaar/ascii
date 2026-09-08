package main

import (
	"flag"
	"fmt"
	"os"
	"strings"
)

func main() {
	font := flag.String("f", "Standard", "font name")
	fontAlias := flag.String("font", "", "font name (long)")
	list := flag.Bool("list", false, "list available fonts")
	preview := flag.String("preview", "", "preview this text")
	width := flag.Int("width", 0, "max width")
	layout := flag.String("layout", "default", "horizontal layout")
	animate := flag.Bool("animate", false, "reveal animation")
	color := flag.Bool("color", true, "colorize output (ANSI)")
	noColor := flag.Bool("no-color", false, "disable color")
	remote := flag.String("remote", "", "remote API base URL")
	flag.Parse()

	if *fontAlias != "" {
		*font = *fontAlias
	}

	if *list {
		fmt.Println("Standard, Big, Slant, Small")
		return
	}

	text := strings.Join(flag.Args(), " ")
	if text == "" && *preview != "" {
		text = *preview
	}
	if text == "" {
		fmt.Fprintln(os.Stderr, "usage: ascii [flags] TEXT")
		os.Exit(1)
	}

	if *remote != "" {
		fmt.Println("remote mode not implemented in local stub; use --remote with the web API")
		return
	}

	fmt.Printf("font=%s width=%d layout=%s animate=%v color=%v\n", *font, *width, *layout, *animate, *color && !*noColor)
	fmt.Println(text)
}

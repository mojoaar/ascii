package figlet

import "testing"

const sample = `flf2a$ 6 5 16 15 11 0 24463 229
Standard by Glenn Chappell & Ian Chai 3/93 -- based on Frank's .sig
Explanation of first line:
flf2a$ "magic number" for file identification
6        height of a character
5        number of comment lines
...
  __ @
 / _|@
| |_ @
 \__|@
     @
     @@
`

func TestRender(t *testing.T) {
	f, err := Parse(sample)
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	out := f.Render("A", 0)
	if len(out) == 0 {
		t.Fatal("empty render")
	}
}

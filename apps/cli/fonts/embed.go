package fonts

import "embed"

//go:embed *.flf
//go:embed *.tlf
//go:embed fonts.json
var FS embed.FS

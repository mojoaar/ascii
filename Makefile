.PHONY: fonts cli cli-all

fonts:
	node scripts/curate-fonts.mjs

cli: fonts
	cd apps/cli && go build -o bin/ascii ./cmd/ascii

cli-all: fonts
	cd apps/cli && ./scripts/build.sh

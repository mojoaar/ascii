.PHONY: fonts cli cli-all

fonts:
	node scripts/curate-fonts.mjs

cli:
	cd apps/cli && go build -o bin/ascii ./cmd/ascii

cli-all:
	cd apps/cli && ./scripts/build.sh

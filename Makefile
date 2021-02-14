build:
	@esbuild --format=esm --bundle index.js --outfile=wel.js
	@esbuild --format=esm --bundle index.js --outfile=wel.min.js --minify

.PHONY: build

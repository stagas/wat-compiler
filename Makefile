build:
	@esbuild --format=esm --bundle index.js --outfile=wat.js
	@esbuild --format=esm --bundle index.js --outfile=wat.min.js --minify

test:
	@mocha-headless

.PHONY: build test

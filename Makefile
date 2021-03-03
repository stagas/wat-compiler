build:
	@esbuild --format=esm --bundle index.js --outfile=wel.js
	@esbuild --format=esm --bundle index.js --outfile=wel.min.js --minify

test:
	@mocha-headless

.PHONY: build test

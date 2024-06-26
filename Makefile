.DEFAULT_GOAL := dev
.PHONY: init dev build

init:
	(cd data && yarn && node export.js)
	(cd frontend && yarn)

lint: init
	(cd frontend && yarn lint)

dev: init
	(cd frontend && yarn dev)

dev-host: init
	(cd frontend && yarn dev --host)

build: init
	(cd frontend && yarn build)

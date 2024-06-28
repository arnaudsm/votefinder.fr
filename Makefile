.DEFAULT_GOAL := dev
.PHONY: init dev build

# Variable pour l'hôte, valeur par défaut vide
# Exemple d'utilisation : `make dev USE_HOST=true` / `make dev USE_HOST=0.0.0.0`
USE_HOST ?=

# Variable pour activer l'utilisation de HTTPS en dev, valeur par défaut vide
# Exemple d'utilisation : `make dev USE_HTTPS=true`
USE_HTTPS ?= false

# Conditionnelle `HOST` pour inclure ou non l'argument `--host` / `--host=$(HOST)`
HOST_ARG := $(if $(USE_HOST), $(if $(filter true,$(USE_HOST)), --host, --host=$(USE_HOST)))

init:
	(cd data && yarn && node export.js)
	(cd frontend && yarn)

lint: init
	(cd frontend && yarn lint)

dev: init
	(cd frontend && USE_HTTPS=$(USE_HTTPS) yarn dev $(HOST_ARG))

build: init
	(cd frontend && yarn build)

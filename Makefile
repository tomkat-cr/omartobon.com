# .DEFAULT_GOAL := local
.PHONY: tests venv
SHELL := /bin/bash

# General Commands
help:
	cat Makefile

install:
	npm install

run:
	sh scripts/run_dev.sh

publish:
	sh scripts/mkdocs_transfer_site.sh
	
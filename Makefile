# .DEFAULT_GOAL := local
.PHONY: tests venv
SHELL := /bin/bash

# General Commands
help:
	cat Makefile

install:
	npm install

run-dev:
	sh scripts/run_dev.sh

publish:
	sh scripts/ftp_transfer_site.sh

# Docker Apache local test environment

up:
	cd local_apache && bash ./local_test_run.sh up

down:
	cd local_apache && bash ./local_test_run.sh down

run: up
stop: down
restart: down up

logs:
	cd local_apache && docker-compose logs

logs-f:
	cd local_apache && docker-compose logs -f

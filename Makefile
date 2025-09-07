# .DEFAULT_GOAL := local
.PHONY: tests venv
SHELL := /bin/bash

# General Commands
help:
	cat Makefile

install:
	npm install

run-dev:
	bash scripts/run_dev.sh

publish-local:
	bash scripts/ftp_transfer_site.sh local

publish-cicd:
	bash scripts/ftp_transfer_site.sh cicd

publish: publish-local

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

init-config:
	cd local_apache && bash ./local_test_run.sh init-config

restore-htaccess:
	cd local_apache && bash ./local_test_run.sh restore-htaccess

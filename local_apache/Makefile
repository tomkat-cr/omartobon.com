help:
	@cat Makefile

up:
	bash ./local_test_run.sh up

down:
	bash ./local_test_run.sh down

run: up
stop: down
restart: down up

logs:
	bash ./local_test_run.sh logs

logs-f:
	bash ./local_test_run.sh logs-f

init-config:
	bash ./local_test_run.sh init-config

restore-htaccess:
	bash ./local_test_run.sh restore-htaccess

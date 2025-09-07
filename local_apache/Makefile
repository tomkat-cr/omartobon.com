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
	docker-compose logs

logs-f:
	docker-compose logs -f

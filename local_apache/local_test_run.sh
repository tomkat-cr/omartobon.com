#!/bin/bash
# local_test_run.sh
# 2025-09-05 | CR

set -euo pipefail
IFS=$'\n\t'

set -o allexport; . ../.env ; set +o allexport ;

ACTION="${ACTION:-$1}"

if [ "$ACTION" = "up" ]; then
    docker-compose up --build
elif [ "$ACTION" = "down" ]; then
    docker-compose down
elif [ "$ACTION" = "logs" ]; then
    docker-compose logs
elif [ "$ACTION" = "logs-f" ]; then
    docker-compose logs -f
else
    echo "Usage: $0 {up|down|logs|logs-f}"
    exit 1
fi

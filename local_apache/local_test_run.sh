#!/bin/bash
# local_test_run.sh
# 2025-09-05 | CR

set -euo pipefail
IFS=$'\n\t'

# shutdown_script() {
#     prepare_config "prod"
# }
# trap shutdown_script EXIT
# trap 'trap - EXIT; shutdown_script; exit' INT TERM

verify_config() {
    if [ ! -f ./config/.htaccess.dev ]; then
        echo "Error: .htaccess.dev file not found"
        echo "Please copy ./www/.htaccess.dev.example to ./local_apache/config/.htaccess.dev"
        echo "or execute 'make init-config' and configure it for development"
        exit 1
    fi
    if [ ! -f ./config/.htaccess.prod ]; then
        echo "Error: .htaccess.prod file not found"
        echo "Please copy ./www/.htaccess.prod.example to ./local_apache/config/.htaccess.prod"
        echo "or execute 'make init-config' and configure it for production"
        exit 1
    fi
}

prepare_config() {
    local action="$1"
    if [ "$action" = "dev" ]; then
        echo "Setting development .htaccess file..."  
        cp ./config/.htaccess.dev ../www/.htaccess
    elif [ "$action" = "prod" ]; then
        echo "Setting production .htaccess file..."
        cp ./config/.htaccess.prod ../www/.htaccess
    else
        echo "ERROR: action must be 'dev' or 'prod'"
        exit 1
    fi
}

init_config() {
    if [ ! -f ./config/.htaccess.dev ]; then
        if ! cp ../www/.htaccess.example ./config/.htaccess.dev
        then
            echo "Error: could not copy .htaccess.example to config/.htaccess.dev"
            exit 1
        fi
    else
        echo "Error: config/.htaccess.dev file already exists"
    fi
    if [ ! -f ./config/.htaccess.prod ]; then
        if ! cp ../www/.htaccess.example ./config/.htaccess.prod
        then
            echo "Error: could not copy .htaccess.example to config/.htaccess.prod"
            exit 1
        fi
    else
        echo "Error: config/.htaccess.prod file already exists"
    fi
}

start_container() {
    echo "Starting local server..."
    verify_config
    prepare_config "dev"
    docker-compose up --build -d
    run_logs_f
}

stop_container() {
    echo "Stopping local server..."
    verify_config
    prepare_config "prod"
    docker-compose down
}

restore_htaccess() {
    echo "Restoring production .htaccess file..."
    verify_config
    prepare_config "prod"
}

run_logs() {
    docker-compose logs
}

run_logs_f() {
    docker-compose logs -f
}

set -o allexport; . ../.env ; set +o allexport ;

ACTION="${ACTION:-$1}"

if [ "$ACTION" = "up" ]; then
    start_container
elif [ "$ACTION" = "down" ]; then
    stop_container
elif [ "$ACTION" = "logs" ]; then
    echo "Showing local server logs..."
    run_logs
elif [ "$ACTION" = "logs-f" ]; then
    echo "Showing local server logs in real-time..."
    run_logs_f
elif [ "$ACTION" = "init-config" ]; then
    echo "Initializing config..."
    init_config
elif [ "$ACTION" = "restore-htaccess" ]; then
    echo "Restoring .htaccess file..."
    restore_htaccess
else
    echo "Usage: $0 {up|down|logs|logs-f|init-config|restore-htaccess}"
    exit 1
fi

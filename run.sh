#!/usr/bin/bash

ENV_FILE=".env"

if [ ! -f "$ENV_FILE" ]; then
    echo "File $ENV_FILE not found"
    exit 1
fi

# Load environment variables
set -o errexit
source .env
set +o errexit

if [[ $1 == "--help" || $1 == "-h" ]]; then
    echo "Usage: ./run.sh [COMMAND]"
    echo
    echo "A script to manage the application via docker-compose"
    echo "Author: Quy Tran <tranphuquy19@gmail.com>"
    echo
    echo "Commands:"
    echo "  build              Build the app (docker-compose down)"
    echo "  up                 Start the app (docker-compose up)"
    echo "  stop               Stop the app (docker-compose stop)"
    echo "  down               Destroy the app (docker-compose down)"
    echo "  reset              Reset the app (docker-compose down-build-up)"
    echo "  docker:build       Build the app image (docker build)"
    echo "  docker:run         Run the app container (docker run)"
    echo "  docker:env         Generate docker env file from .env file"
    echo
    echo "Run './run.sh --help' for more information."
elif [[ $1 == "build" ]]; then
    docker-compose -p $STACK_NAME build
elif [[ $1 == "up" ]]; then
    docker-compose -p $STACK_NAME up -d
elif [[ $1 == "stop" ]]; then
    docker-compose -p $STACK_NAME stop
elif [[ $1 == "down" ]]; then
    docker-compose -p $STACK_NAME down  --volumes
elif [[ $1 == "reset" ]]; then
    docker-compose -p $STACK_NAME down  --volumes
    docker-compose -p $STACK_NAME build
    docker-compose -p $STACK_NAME up -d
elif [[ $1 == "docker:build" ]]; then
    bash create-image.sh
elif [[ $1 == "docker:env" ]]; then
    bash -c 'sed -e "s/=\"/=/g" -e "s/\"$//g" .env > .env.docker'
elif [[ $1 == "docker:run" ]]; then
    docker run --env-file .env.docker $STACK_NAME
else
    echo "Unknown command: $1"
fi

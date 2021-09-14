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
    echo "  up          Start the app (docker-compose up)"
    echo "  stop        Start the app (docker-compose stop)"
    echo "  down        Destroy the app (docker-compose down)"
    echo "  build       Build the app image (docker build)"
    echo "  docker:env  Generate docker env file from .env file"
    echo "  run         Run the app container (docker run)"
    echo
    echo "Run './run.sh --help' for more information."
elif [[ $1 == "up" ]]; then
    docker-compose -p $STACK_NAME up -d
elif [[ $1 == "stop" ]]; then
    docker-compose -p $STACK_NAME stop
elif [[ $1 == "down" ]]; then
    docker-compose -p $STACK_NAME down  --volumes
elif [[ $1 == "build" ]]; then
    bash create-image.sh
elif [[ $1 == "docker:env" ]]; then
    bash -c 'sed -e "s/=\"/=/g" -e "s/\"$//g" .env > .env.docker'
elif [[ $1 == "run" ]]; then
    docker run --env-file .env.docker $STACK_NAME
else
    echo "Unknown command: $1"
fi

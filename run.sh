#!/usr/bin/bash

ENV_FILE=".env"
ENV_TEMPLATE_FILE=".env.template"
DOCKER_ENV_FILE=".env.docker"

PROD_DOCKER_COMPOSE_FILE="docker-compose.yml"
DEV_DOCKER_COMPOSE_FILE="docker-compose.dev.yml"

POSTGRES_POSTFIX="pgsql"
REDIS_POSTFIX="redis"

export COMPOSE_DOCKER_CLI_BUILD=1
export DOCKER_BUILDKIT=1

if [ ! -f "$ENV_FILE" ]; then
    echo "File $ENV_FILE not found"
    exit 1
fi

# Load environment variables
set -a
source $ENV_FILE
set +a

if [[ $1 == "--help" || $1 == "-h" ]]; then
    echo "Usage: ./run.sh [COMMAND] [OPTIONS]"
    echo
    echo "A script to manage the application via docker-compose"
    echo "Author: Quy Tran <tranphuquy19@gmail.com>"
    echo
    echo "Commands:"
    echo "  build              Build the app (docker-compose build)"
    echo "  up                 Start the app (docker-compose up)"
    echo "  stop               Stop the app (docker-compose stop)"
    echo "  down               Destroy the app (docker-compose down)"
    echo "  down:volumes       Destroy the app & data"
    echo "  clean              Remove all dangling images, builders, build-caches"
    echo "  reset              Reset the app (docker-compose down-build-up)"
    echo "  docker:build       Build the app image (docker build)"
    echo "  docker:run         Run the app container (docker run)"
    echo "  docker:env         Generate docker env file from .env file"
    echo
    echo "Options:"
    echo "  -h, --help         Show this help message"
    echo "  -p, --production   Production environment"
    echo "  -d, --development  Development environment"
    echo
    echo "Run './run.sh --help' for more information."
    echo
elif [[ $1 == "build" ]]; then
    docker-compose -p $STACK_NAME build

elif [[ $1 == "up" ]]; then
    if [[ $2 == "" || $2 == "--production" || $2 == "-p" ]]; then
        docker-compose -p $STACK_NAME -f $PROD_DOCKER_COMPOSE_FILE up -d
    elif [[ $2 == "--development" || $2 == "-d" ]]; then
        docker-compose -p $STACK_NAME -f $DEV_DOCKER_COMPOSE_FILE up -d
        yarn start:dev
    fi

elif [[ $1 == "stop" ]]; then
    if [[ $2 == "" || $2 == "--production" || $2 == "-p" ]]; then
        docker-compose -p $STACK_NAME -f $PROD_DOCKER_COMPOSE_FILE stop
    elif [[ $2 == "--development" || $2 == "-d" ]]; then
        docker-compose -p $STACK_NAME -f $DEV_DOCKER_COMPOSE_FILE stop
    fi

elif [[ $1 == "down" ]]; then
    if [[ $2 == "" || $2 == "--production" || $2 == "-p" ]]; then
        docker-compose -p $STACK_NAME -f $PROD_DOCKER_COMPOSE_FILE down
    elif [[ $2 == "--development" || $2 == "-d" ]]; then
        docker-compose -p $STACK_NAME -f $DEV_DOCKER_COMPOSE_FILE down
    fi

elif [[ $1 == "down:volumes" ]]; then
    if [[ $2 == "" || $2 == "--production" || $2 == "-p" ]]; then
        docker-compose -p $STACK_NAME -f $PROD_DOCKER_COMPOSE_FILE down --volumes
    elif [[ $2 == "--development" || $2 == "-d" ]]; then
        docker-compose -p $STACK_NAME -f $DEV_DOCKER_COMPOSE_FILE down --volumes
    fi

elif [[ $1 == "clean" ]]; then
    echo "Remove dangling images"
    docker image prune -f
    echo "Remove dangling builders"
    docker builder prune -f
    echo "Remove dangling build-caches"
    docker buildx prune -f

elif [[ $1 == "reset" ]]; then
    if [[ $2 == "" || $2 == "--production" || $2 == "-p" ]]; then
        docker-compose -p $STACK_NAME -f $PROD_DOCKER_COMPOSE_FILE down --volumes
        docker-compose -p $STACK_NAME -f $PROD_DOCKER_COMPOSE_FILE build
        docker-compose -p $STACK_NAME -f $PROD_DOCKER_COMPOSE_FILE up -d
    elif [[ $2 == "--development" || $2 == "-d" ]]; then
        docker-compose -p $STACK_NAME -f $DEV_DOCKER_COMPOSE_FILE down --volumes
        docker-compose -p $STACK_NAME -f $DEV_DOCKER_COMPOSE_FILE build
        docker-compose -p $STACK_NAME -f $DEV_DOCKER_COMPOSE_FILE up -d
    fi

elif [[ $1 == "docker:build" ]]; then
    bash create-image.sh

elif [[ $1 == "docker:env" ]]; then
    export NODE_ENV=production
    export LISTEN_ON="0.0.0.0"
    export DATABASE_HOST="${STACK_NAME}-${POSTGRES_POSTFIX}"
    export REDIS_URL="${STACK_NAME}-${REDIS_POSTFIX}"
    export LOG_FORMAT="combined"
    envsubst <$ENV_TEMPLATE_FILE >$DOCKER_ENV_FILE

elif [[ $1 == "docker:run" ]]; then
    docker run --env-file $DOCKER_ENV_FILE $STACK_NAME

else
    echo "Unknown command: $1"
fi

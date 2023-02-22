#!/usr/bin/bash

# This script is used to manage the application. Run `./run.sh --help` for more information.

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

run_command() {
    # Define colors for output
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[0;33m'
    BLUE='\033[0;34m'
    PURPLE='\033[0;35m'
    CYAN='\033[0;36m'
    NC='\033[0m' # No Color

    # Print the command in blue
    printf "${BLUE}> %s${NC}\n" "$*"

    # Execute the command and capture its exit code
    "$@"
    local exit_code=$?

    # Print the exit code in green if successful, red otherwise
    if [ $exit_code -eq 0 ]; then
        printf "${GREEN}Command succeeded with exit code %d${NC}\n" $exit_code
    else
        printf "${RED}Command failed with exit code %d${NC}\n" $exit_code
    fi

    return $exit_code
}

if [[ $1 == "--help" || $1 == "-h" ]]; then
    echo "Usage: ./run.sh [COMMAND] [OPTIONS]"
    echo
    echo "A script to manage the application via docker-compose"
    echo "Author: Quy Tran <tranphuquy19@gmail.com>"
    echo
    echo "Commands:"
    echo "  build              Build the app (docker-compose build). Only: prod env."
    echo "  up                 Start the app (docker-compose up)"
    echo "  up:admin           Start the admin services (pgadmin, redisadmin, etc.). Only: prod env."
    echo "  up:all             Start the app & admin services. Only: prod env."
    echo "  stop               Stop the app (docker-compose stop)"
    echo "  down               Destroy the app (docker-compose down)"
    echo "  down:volumes       Destroy the app & data"
    echo "  stop:admin         Stop the admin services. Only: prod env."
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

elif [[ $1 == "build" ]]; then # Example: ./run.sh build --no-cache
    run_command docker-compose --project-name $STACK_NAME --profile nodeapp -f $PROD_DOCKER_COMPOSE_FILE build ${@:2}


# Examples: 
#   ./run.sh up --production
#   ./run.sh up --development
#   ./run.sh up -p
#   ./run.sh up -d
#   ./run.sh up                 # Default is production
elif [[ $1 == "up" ]]; then 
    if [[ $2 == "" || $2 == "--production" || $2 == "-p" ]]; then
        # Ask user for Database migration
        read -p "Do you want to migrate the database? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            run_command docker-compose --project-name $STACK_NAME --profile db -f $PROD_DOCKER_COMPOSE_FILE up -d
            # Wait for database to be ready
            echo "Waiting for database to be ready..."
            sleep 10
        fi

        run_command docker-compose --project-name $STACK_NAME --profile prod -f $PROD_DOCKER_COMPOSE_FILE up -d

    elif [[ $2 == "--development" || $2 == "-d" ]]; then
        # Ask user for Database migration
        read -p "Do you want to migrate the database? (y/n) " -n 1 -r
        echo
        run_command docker-compose --project-name $STACK_NAME -f $DEV_DOCKER_COMPOSE_FILE up -d
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            run_command yarn typeorm:migration:run
        fi
        run_command yarn start:dev
    fi

elif [[ $1 == "up:admin" ]]; then
    run_command docker-compose --project-name $STACK_NAME --profile admin -f $PROD_DOCKER_COMPOSE_FILE up -d --no-recreate

elif [[ $1 == "up:all" ]]; then
    run_command docker-compose --project-name $STACK_NAME --profile prod,admin -f $PROD_DOCKER_COMPOSE_FILE up -d

elif [[ $1 == "stop" ]]; then
    if [[ $2 == "" || $2 == "--production" || $2 == "-p" ]]; then
        run_command docker-compose --project-name $STACK_NAME -f $PROD_DOCKER_COMPOSE_FILE stop
    elif [[ $2 == "--development" || $2 == "-d" ]]; then
        run_command docker-compose --project-name $STACK_NAME -f $DEV_DOCKER_COMPOSE_FILE stop
    fi

elif [[ $1 == "down" ]]; then
    if [[ $2 == "" || $2 == "--production" || $2 == "-p" ]]; then
        run_command docker-compose --project-name $STACK_NAME --profile all -f $PROD_DOCKER_COMPOSE_FILE down
    elif [[ $2 == "--development" || $2 == "-d" ]]; then
        run_command docker-compose --project-name $STACK_NAME -f $DEV_DOCKER_COMPOSE_FILE down
    fi

elif [[ $1 == "stop:admin" ]]; then
    run_command docker-compose --project-name $STACK_NAME -f $PROD_DOCKER_COMPOSE_FILE stop pgadmin

elif [[ $1 == "down:volumes" ]]; then
    if [[ $2 == "" || $2 == "--production" || $2 == "-p" ]]; then
        run_command docker-compose --project-name $STACK_NAME -f $PROD_DOCKER_COMPOSE_FILE down --volumes
    elif [[ $2 == "--development" || $2 == "-d" ]]; then
        run_command docker-compose --project-name $STACK_NAME -f $DEV_DOCKER_COMPOSE_FILE down --volumes
    fi

elif [[ $1 == "clean" ]]; then
    echo "Remove dangling images"
    run_command docker image prune -f
    echo "Remove dangling builders"
    run_command docker builder prune -f
    echo "Remove dangling build-caches"
    run_command docker buildx prune -f

elif [[ $1 == "reset" ]]; then
    if [[ $2 == "" || $2 == "--production" || $2 == "-p" ]]; then
        run_command docker-compose --project-name $STACK_NAME -f $PROD_DOCKER_COMPOSE_FILE down --volumes
        run_command docker-compose --project-name $STACK_NAME -f $PROD_DOCKER_COMPOSE_FILE build
        run_command docker-compose --project-name $STACK_NAME -f $PROD_DOCKER_COMPOSE_FILE up -d
    elif [[ $2 == "--development" || $2 == "-d" ]]; then
        run_command docker-compose --project-name $STACK_NAME -f $DEV_DOCKER_COMPOSE_FILE down --volumes
        run_command docker-compose --project-name $STACK_NAME -f $DEV_DOCKER_COMPOSE_FILE build
        run_command docker-compose --project-name $STACK_NAME -f $DEV_DOCKER_COMPOSE_FILE up -d
    fi

elif [[ $1 == "docker:build" ]]; then
    run_command bash create-image.sh

elif [[ $1 == "docker:env" ]]; then
    export NODE_ENV=production
    export LISTEN_ON="0.0.0.0"
    export DATABASE_HOST="${STACK_NAME}-${POSTGRES_POSTFIX}"
    export REDIS_URL="${STACK_NAME}-${REDIS_POSTFIX}"
    export LOG_FORMAT="combined"
    run_command envsubst <$ENV_TEMPLATE_FILE >$DOCKER_ENV_FILE

elif [[ $1 == "docker:run" ]]; then
    run_command docker run --env-file $DOCKER_ENV_FILE $STACK_NAME

else
    echo "Unknown command: $1"
fi

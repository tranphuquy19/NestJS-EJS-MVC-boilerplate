#!/bin/bash

ENV_FILE=".env"

if [ ! -f "$ENV_FILE" ]; then
    echo "File $ENV_FILE not found"
    exit 1
fi

# Load environment variables
set -o errexit
source .env
set +o errexit

yarn prebuild

echo "remove the container"
docker rm -f $STACK_NAME

echo "remove the image"
docker rmi -f $STACK_NAME

echo "create the image"
docker build -t $STACK_NAME .

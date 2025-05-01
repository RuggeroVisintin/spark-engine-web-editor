#!/bin/bash
set -e

npm run license-check

if [ -f .env ]; then
    echo "Loading environment variables"
    source .env

    # if SPARK_ENGINE_PATH is not empty, then link it to the current directory
    if [ -n "$SPARK_ENGINE_PATH" ]; then
        echo "Creating symlink to Spark Engine development path"
        rm -rf ./node_modules/sparkengineweb
        ln -s $SPARK_ENGINE_PATH/dist/lib ./node_modules/sparkengineweb
    else
        echo "Could not find SPARK_ENGINE_PATH in .env file. Skipping"
    fi
fi
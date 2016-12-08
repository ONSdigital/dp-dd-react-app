#!/usr/bin/env bash

HAS_NPM=false
HAS_YARN=false

if type "npm" > /dev/null; then
    HAS_NPM=true
fi

if type "yarn" > /dev/null; then
    HAS_YARN=true
fi

if "$HAS_YARN" = true; then
    echo "Running Yarn install..."
    yarn
elif "$HAS_NPM" = true; then
    echo "Yarn not available, running NPM install instead"
    npm install
else
    echo "Neither NPM or Yarn installed, build stopped."
    exit 1
fi

echo "Now we run webpack dev"

#!/bin/bash -eux

pushd dp-dd-react-app
  npm install --unsafe-perm
popd

cp -r dp-dd-react-app/dist/* dist/

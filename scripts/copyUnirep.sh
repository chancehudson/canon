#!/bin/sh

set -e

# Pass an argument to this script that is the unirep monorepo directory
# this argument must be absolute
# e.g. yarn linkUnirep $(pwd)/../unirep

rm -rf packages/relay/node_modules/@unirep/core
rm -rf packages/relay/node_modules/@unirep/contracts
rm -rf packages/relay/node_modules/@unirep/utils
rm -rf packages/relay/node_modules/@unirep/circuits
cp -r $1/packages/core/build $(pwd)/packages/relay/node_modules/@unirep/core
cp -r $1/packages/contracts/build $(pwd)/packages/relay/node_modules/@unirep/contracts
cp -r $1/packages/utils/build $(pwd)/packages/relay/node_modules/@unirep/utils
cp -r $1/packages/circuits/dist $(pwd)/packages/relay/node_modules/@unirep/circuits

rm -rf packages/frontend/node_modules/@unirep/core
rm -rf packages/frontend/node_modules/@unirep/contracts
rm -rf packages/frontend/node_modules/@unirep/utils
rm -rf packages/frontend/node_modules/@unirep/circuits
cp -r $1/packages/core/build $(pwd)/packages/frontend/node_modules/@unirep/core
cp -r $1/packages/contracts/build $(pwd)/packages/frontend/node_modules/@unirep/contracts
cp -r $1/packages/utils/build $(pwd)/packages/frontend/node_modules/@unirep/utils
cp -r $1/packages/circuits/dist $(pwd)/packages/frontend/node_modules/@unirep/circuits

rm -rf packages/contracts/node_modules/@unirep/core
rm -rf packages/contracts/node_modules/@unirep/contracts
rm -rf packages/contracts/node_modules/@unirep/utils
rm -rf packages/contracts/node_modules/@unirep/circuits
cp -r $1/packages/core/build $(pwd)/packages/contracts/node_modules/@unirep/core
cp -r $1/packages/contracts/build $(pwd)/packages/contracts/node_modules/@unirep/contracts
cp -r $1/packages/utils/build $(pwd)/packages/contracts/node_modules/@unirep/utils
cp -r $1/packages/circuits/dist $(pwd)/packages/contracts/node_modules/@unirep/circuits

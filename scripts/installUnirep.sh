#!/bin/sh

set -e

# Install a compatible version of the unirep source for this build
curl https://pub-0a2a0097caa84eb18d3e5c165665bffb.r2.dev/unirep-beta-1.tar.gz -OJL
shasum -a 256 unirep-beta-1.tar.gz | grep '3352ab1803022bc82da3426003f83a4fbdfa3324ca552d7615a8894a42436301'
tar -xzf unirep-beta-1.tar.gz
rm unirep-beta-1.tar.gz
mv unirep-beta-1 @unirep

rm -rf packages/contracts/node_modules/@unirep
rm -rf packages/relay/node_modules/@unirep
rm -rf packages/frontend/node_modules/@unirep

cp -r @unirep packages/contracts/node_modules/@unirep
cp -r @unirep packages/relay/node_modules/@unirep
cp -r @unirep packages/frontend/node_modules/@unirep

rm -rf @unirep
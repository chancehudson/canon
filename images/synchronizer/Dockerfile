# |==============================[ rapidsnark build stage ]=============================================|
# Build stage for rapidsnark
FROM node:16-buster-slim as rapidsnark-builder

# update global dependencies & add rapidsnark build dependencies
RUN apt-get update && apt-get install git curl build-essential libgmp-dev libsodium-dev nasm -y

# Build iden3/rapidsnark source
RUN git clone https://github.com/iden3/rapidsnark.git && \
    cd rapidsnark && \
    git submodule init && \
    git submodule update && \
    npm install && \
    npx task createFieldSources && \
    npx task buildProver

# |=================================[ canon build stage ]===============================================|
# Build stage for unirep source (custom branch checkout)
FROM node:16-buster-slim as canon-builder

# update global dependencies & add build dependencies
RUN apt-get update && apt-get install git build-essential curl -y

# Get compatible version of unirep
RUN curl https://pub-0a2a0097caa84eb18d3e5c165665bffb.r2.dev/unirep-beta-1.tar.gz -OJL && \
    shasum -a 256 unirep-beta-1.tar.gz | grep '3352ab1803022bc82da3426003f83a4fbdfa3324ca552d7615a8894a42436301' && \
    tar -xzf unirep-beta-1.tar.gz && \
    rm unirep-beta-1.tar.gz && \
    mv unirep-beta-1 unirep

# Copy canon from local source
COPY . /canon

# Link compatible version of unirep to canon dependencies
RUN cd canon && yarn install && cd packages && \
    rm -rf contracts/node_modules/@unirep relay/node_modules/@unirep frontend && \
    cp -r /unirep ./contracts/node_modules/@unirep && \
    cp -r /unirep ./relay/node_modules/@unirep

# |=================================[ final stage ]===============================================|
FROM node:16-buster-slim as daemon
RUN apt-get update && apt-get install curl build-essential libgmp-dev libsodium-dev nasm -y

COPY --from=canon-builder /canon /canon
COPY --from=rapidsnark-builder /rapidsnark/build/prover /usr/local/bin/rapidsnark

WORKDIR /canon/packages/relay

EXPOSE 8000
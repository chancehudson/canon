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

# Build stage for canon unirep app
FROM node:16-buster as canon-builder

RUN apt-get update && apt-get install curl build-essential libgmp-dev libsodium-dev nasm -y

COPY . /src

WORKDIR /src

RUN yarn && rm -rf packages/frontend

RUN rm -rf /src/packages/relay/node_modules/@unirep
RUN rm -rf /src/packages/contracts/node_modules/@unirep
COPY packages/relay/node_modules/@unirep /src/packages/relay/node_modules/@unirep
COPY packages/contracts/node_modules/@unirep /src/packages/contracts/node_modules/@unirep

RUN rm -rf /src/packages/relay/node_modules/@unirep/circuits/zksnarkBuild
RUN rm -rf /src/packages/contracts/node_modules/@unirep/circuits/zksnarkBuild

FROM node:16-buster-slim as daemon
RUN apt-get update && apt-get install curl build-essential libgmp-dev libsodium-dev nasm -y

COPY --from=canon-builder /src /src
COPY --from=rapidsnark-builder /rapidsnark/build/prover /usr/local/bin

WORKDIR /src/packages/relay

CMD ["npm", "start"]

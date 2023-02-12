# |=================================[ canon frontend ]===============================================|
#Build stage for unirep source (custom branch checkout)
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

# Link compatible version of unirep to canon dependencies && build frontend
RUN cd canon && yarn && cd packages && \
    rm -rf frontend/node_modules/@unirep contracts/node_modules/@unirep relay && \
    cp -r /unirep ./frontend/node_modules/@unirep && \
    cp -r /unirep ./contracts/node_modules/@unirep

# Expose port
EXPOSE 3000
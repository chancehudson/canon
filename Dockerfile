FROM node:16-buster

COPY . /src

WORKDIR /src

RUN yarn && rm -rf packages/frontend

WORKDIR /src/packages/relay

CMD ["npm", "start"]

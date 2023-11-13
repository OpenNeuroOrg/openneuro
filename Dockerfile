FROM docker.io/library/node:18.17.1-bullseye as dependencies

WORKDIR /srv

COPY . /srv

RUN yarn install && yarn tsc -b

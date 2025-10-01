FROM docker.io/library/node:22.20-bullseye as dependencies

WORKDIR /srv

COPY . /srv

RUN yarn install && yarn tsc -b

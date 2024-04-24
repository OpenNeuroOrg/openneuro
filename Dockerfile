FROM docker.io/library/node:20.12.2-bullseye as dependencies

WORKDIR /srv

COPY . /srv

RUN yarn install && yarn tsc -b

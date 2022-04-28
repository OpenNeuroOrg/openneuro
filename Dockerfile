FROM node:16.15.0 as dependencies

WORKDIR /srv

COPY . /srv

RUN yarn install && yarn tsc -b

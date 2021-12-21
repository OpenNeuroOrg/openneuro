FROM node:16.13.1 as dependencies

WORKDIR /srv

COPY . /srv

RUN yarn install && yarn tsc -b

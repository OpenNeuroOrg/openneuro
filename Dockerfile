FROM node:17.9.0 as dependencies

WORKDIR /srv

COPY . /srv

RUN yarn install && yarn tsc -b

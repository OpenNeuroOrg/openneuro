FROM node:18.15.0 as dependencies

WORKDIR /srv

COPY . /srv

RUN yarn install && yarn tsc -b

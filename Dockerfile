FROM node:18.1.0 as dependencies

WORKDIR /srv

COPY . /srv

RUN yarn install && yarn tsc -b

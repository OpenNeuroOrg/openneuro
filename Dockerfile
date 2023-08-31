FROM node:18.17.1 as dependencies

WORKDIR /srv

COPY . /srv

RUN yarn install && yarn tsc -b

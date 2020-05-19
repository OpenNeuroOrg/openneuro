FROM node:12.13.0

WORKDIR /srv

COPY ./ /srv

RUN yarn install

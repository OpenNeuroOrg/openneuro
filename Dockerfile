FROM node:12.18.1

WORKDIR /srv

COPY ./ /srv

RUN yarn install

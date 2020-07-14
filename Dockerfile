FROM node:14.5.0

WORKDIR /srv

COPY ./ /srv

RUN yarn install

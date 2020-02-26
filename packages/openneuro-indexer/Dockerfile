FROM node:12.16.1-alpine as indexer

ADD . /srv
WORKDIR /srv
RUN apk add git && yarn
WORKDIR /srv/packages/openneuro-indexer
CMD ["yarn", "openneuro-indexer"]

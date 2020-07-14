FROM node:12.18.2-alpine3.12 as indexer

ADD . /srv
WORKDIR /srv
RUN apk add git && yarn
WORKDIR /srv/packages/openneuro-indexer
CMD ["yarn", "openneuro-indexer"]

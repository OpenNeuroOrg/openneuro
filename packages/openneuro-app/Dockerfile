FROM node:8.9.4-alpine

RUN apk --no-cache --update add git make gcc g++ python

ADD . /srv

# setup app directory
WORKDIR /srv

# Build the frontend
RUN npm install -g yarn && yarn install --pure-lockfile && yarn bootstrap && apk del make gcc g++ python

WORKDIR /srv/packages/openneuro-app

CMD yarn build

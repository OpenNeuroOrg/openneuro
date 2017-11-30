FROM node:6.11.3-alpine

RUN apk --no-cache --update add git

# add the monorepo
ADD . /build

# setup app directory
WORKDIR /build/app

# Build the frontend
RUN npm install -g yarn &&\
  yarn install --pure-lockfile &&\
  mkdir -p /srv/app &&\
  yarn build &&\
  cp -r /build/app/dist /srv/app/dist

WORKDIR /srv/app

# Reduce the final image size
RUN rm -rf /build && apk del git
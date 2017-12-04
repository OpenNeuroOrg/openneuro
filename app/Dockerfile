FROM node:6.12.0-alpine

RUN apk --no-cache --update add git

ADD . /srv

# setup app directory
WORKDIR /srv/app

# Build the frontend
RUN npm install -g yarn && yarn install --pure-lockfile

CMD yarn build

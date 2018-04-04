FROM node:8.9.4-alpine

RUN apk --no-cache --update add git

ADD . /srv

# setup app directory
WORKDIR /srv

# Build the frontend
RUN npm install -g yarn && yarn install --pure-lockfile

CMD yarn build

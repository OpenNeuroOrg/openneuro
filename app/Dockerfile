FROM node:6.11.3-alpine

RUN apk --no-cache --update add git

# accept 'branch' build argument
ARG branch

# setup app directory
WORKDIR /srv/crn-app

# install web app
ADD . /srv/crn-app
RUN npm install -g yarn && yarn install --pure-lockfile

# build app
CMD yarn build

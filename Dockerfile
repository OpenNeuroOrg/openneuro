FROM node:14.16.0 as dependencies

WORKDIR /srv

COPY . /srv

RUN yarn install && yarn tsc -b

FROM dependencies as tests

RUN yarn test

FROM node:10.15.3-alpine AS app

RUN apk --no-cache --update add git make gcc g++ python

ADD . /srv

# setup app directory
WORKDIR /srv

# Build the frontend
RUN yarn install --pure-lockfile && yarn bootstrap && apk del make gcc g++ python

WORKDIR /srv/packages/openneuro-app

RUN yarn build && cp maintenance.html dist/


FROM nginx:alpine AS web
COPY --from=app /srv/packages/openneuro-app/dist /srv/app/dist


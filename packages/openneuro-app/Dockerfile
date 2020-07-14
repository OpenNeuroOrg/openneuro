FROM node:12.18.2-alpine3.12 AS app

RUN apk --no-cache --update add git

ADD . /srv

# setup app directory
WORKDIR /srv

# Build the frontend
RUN yarn install --pure-lockfile && yarn bootstrap

WORKDIR /srv/packages/openneuro-app

RUN yarn build && cp maintenance.html dist/


FROM nginx:alpine AS web
COPY --from=app /srv/packages/openneuro-app/dist /srv/app/dist
COPY packages/openneuro-app/nginx.conf /etc/nginx/conf.d/default.conf


FROM node:12.18.2-alpine3.12 AS build

# install server app
ADD . /srv
WORKDIR /srv
RUN apk add curl git --no-cache --update
WORKDIR /srv/packages/openneuro-server
RUN yarn install --focus --production && yarn build

FROM node:12.18.2-alpine3.12 AS server

COPY --from=build /srv/node_modules /srv/node_modules
COPY --from=build /srv/packages/openneuro-server/dist /srv/dist
HEALTHCHECK --interval=10s --retries=10 CMD curl -f 'http://localhost:8111' || exit 1

ENV NODE_OPTIONS=--max_old_space_size=1024

# start server
CMD ["node", "/srv/dist/src/server.js"]

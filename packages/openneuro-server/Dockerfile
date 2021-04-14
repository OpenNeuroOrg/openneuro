FROM openneuro/node AS build

# install server app
WORKDIR /srv/packages/openneuro-server
RUN yarn build

FROM node:14.16.0-alpine3.12

WORKDIR /srv

COPY --from=build /srv/node_modules /srv/node_modules
COPY --from=build /srv/packages/openneuro-server/dist /srv/dist

HEALTHCHECK --interval=10s --retries=10 CMD curl -f 'http://localhost:8111' || exit 1

ENV NODE_OPTIONS=--max_old_space_size=2048

# start server
CMD ["node", "/srv/dist/server.js"]

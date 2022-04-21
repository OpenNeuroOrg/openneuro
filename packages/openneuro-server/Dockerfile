FROM openneuro/node AS build

# install server app
WORKDIR /srv/packages/openneuro-server
RUN yarn build

FROM node:14.16.0-alpine3.12

WORKDIR /srv

COPY --from=build /srv/packages/openneuro-server/package.json /srv/package.json
COPY --from=build /srv/.yarnrc.yml /srv/.yarnrc.yml
COPY --from=build /srv/.yarn /srv/.yarn
COPY --from=build /srv/.pnp.cjs /srv/.pnp.cjs
COPY --from=build /srv/.pnp.loader.mjs /srv/.pnp.loader.mjs
COPY --from=build /srv/packages/openneuro-search /srv/packages/openneuro-search
COPY --from=build /srv/packages/openneuro-server/dist /srv/packages/openneuro-server/dist

HEALTHCHECK --interval=10s --retries=10 CMD curl -f 'http://localhost:8111' || exit 1

ENV NODE_OPTIONS=--max_old_space_size=2048

# start server
CMD ["node", "-r", "/srv/.pnp.cjs", "/srv/packages/openneuro-server/dist/server.js"]

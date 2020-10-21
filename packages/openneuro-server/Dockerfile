FROM openneuro/node AS build

# install server app
WORKDIR /srv/packages/openneuro-server
RUN yarn build

HEALTHCHECK --interval=10s --retries=10 CMD curl -f 'http://localhost:8111' || exit 1

ENV NODE_OPTIONS=--max_old_space_size=2048

# start server
CMD ["node", "/srv/packages/openneuro-server/dist/src/server.js"]

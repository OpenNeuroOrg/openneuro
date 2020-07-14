FROM node:14.5.0-alpine3.12

# install server app
ADD . /srv
WORKDIR /srv
RUN apk add curl git --no-cache --update && yarn install
WORKDIR /srv/packages/openneuro-server
RUN yarn build

HEALTHCHECK --interval=10s --retries=10 CMD curl -f 'http://localhost:8111' || exit 1

ENV NODE_OPTIONS=--max_old_space_size=1024

# start server
CMD ["node", "/srv/dist/src/server.js"]

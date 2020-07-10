FROM node:12.18.0-alpine3.12

# install server app
ADD . /srv
WORKDIR /srv
RUN apk add curl git --no-cache --update && yarn install

HEALTHCHECK --interval=10s --retries=10 CMD curl -f 'http://localhost:8111' || exit 1

ENV NODE_OPTIONS=--max_old_space_size=1024

# start server
CMD ["ts-node", "/srv/src/server.js"]

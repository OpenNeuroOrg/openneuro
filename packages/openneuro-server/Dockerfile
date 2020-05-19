FROM node:12.16.1-alpine

# install server app
ADD . /srv
WORKDIR /srv
RUN apk add curl git make gcc g++ python --no-cache --update && \
  yarn install && \
  apk del make gcc g++ python

HEALTHCHECK --interval=10s --retries=10 CMD curl -f 'http://localhost:8111' || exit 1

ENV NODE_OPTIONS=--max_old_space_size=1024

# start server
CMD ["node", "/srv/src/index.js"]

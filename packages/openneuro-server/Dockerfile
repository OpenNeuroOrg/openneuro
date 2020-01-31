FROM node:10.15.3-alpine

# install server app
ADD . /srv
WORKDIR /srv
RUN apk add git make gcc g++ python --no-cache --update && \
  npm install -g yarn && \
  yarn install && \
  apk del make gcc g++ python

ENV NODE_OPTIONS=--max_old_space_size=1024

# start server
CMD ["node", "/srv/index.js"]

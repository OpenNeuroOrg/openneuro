FROM node:8.9.4-alpine

# install server app
ADD . /srv
WORKDIR /srv
RUN apk add git make gcc g++ python --no-cache --update && \
  npm install -g yarn && \
  yarn install && \
  apk del make gcc g++ python

# start server
CMD ["node", "/srv/index.js"]

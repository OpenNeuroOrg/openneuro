FROM node:8.9.4-alpine

# install server app
ADD . /srv
WORKDIR /srv
RUN apk add git --no-cache --update && npm install -g yarn && yarn install

# start server
CMD ["node", "/srv/index.js"]

FROM node:8.9.4-alpine

# install server app
ADD . /srv
WORKDIR /srv
RUN apk add git --no-cache --update && npm install -g yarn && yarn install

# Reduce the final image size
RUN rm -rf /srv/app

# start server
CMD ["node", "/srv/index.js"]

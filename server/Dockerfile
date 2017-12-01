FROM node:6.11.3-alpine

# install server app
ADD . /srv
WORKDIR /srv/server
RUN npm install -g yarn && yarn install

# Reduce the final image size
RUN rm -rf /srv/app

# start server
CMD ["node", "/srv/server/index.js"]

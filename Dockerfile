FROM node:4.4.1

# accept 'branch' build argument
ARG branch

# setup server directory
RUN mkdir /srv/crn-server
WORKDIR /srv/crn-server

# install server app
RUN apt-get install git
RUN git clone -b $branch https://github.com/poldracklab/crn_server.git /srv/crn-server/
RUN npm install

# start server
CMD ["node", "/srv/crn-server/index.js"]

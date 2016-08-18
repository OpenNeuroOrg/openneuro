FROM node:4.4.1

# accept 'branch' build argument
ARG branch

# setup app directory
WORKDIR /srv/crn-app

# install web app
ADD . /srv/crn-app
RUN npm install
RUN npm install -g gulp-cli

# build app
CMD gulp build

FROM node:6.11.2

# accept 'branch' build argument
ARG branch

# setup app directory
WORKDIR /srv/crn-app

# install web app
ADD . /srv/crn-app
RUN npm install
RUN npm install -g gulp-cli yarn

# build app
CMD gulp build

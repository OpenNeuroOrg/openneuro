FROM node:4.4.1

# accept 'branch' build argument
ARG branch

# setup app directory
WORKDIR /srv/crn-app

# install web app
RUN apt-get install git
RUN git clone -b $branch https://github.com/poldracklab/crn_app.git /srv/crn-app/
RUN npm install
RUN npm install -g gulp-cli

# configure web app
COPY config.js /srv/crn-app/

# build app
CMD gulp build

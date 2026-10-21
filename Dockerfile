FROM docker.io/library/node:26.12.1-trixie as dependencies

WORKDIR /srv

COPY . /srv

RUN npm install --global corepack@0.36.0 && corepack enable && yarn install && yarn tsc -b

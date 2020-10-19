FROM node:12.18.1 as dependencies

WORKDIR /srv

COPY package.json yarn.lock ./
# Sadly we have to manually copy each of these to get a full node_modules tree
COPY packages/openneuro-app/package.json packages/openneuro-app/package.json
COPY packages/openneuro-cli/package.json packages/openneuro-cli/package.json
COPY packages/openneuro-client/package.json packages/openneuro-client/package.json
COPY packages/openneuro-indexer/package.json packages/openneuro-indexer/package.json
COPY packages/openneuro-server/package.json packages/openneuro-server/package.json

RUN yarn install --frozen-lockfile

COPY . /srv

FROM dependencies as tests

RUN yarn test

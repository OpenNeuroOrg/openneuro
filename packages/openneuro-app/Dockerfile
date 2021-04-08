FROM openneuro/node AS web

WORKDIR /srv/packages/openneuro-app
RUN yarn build && cp maintenance.html src/dist/client

CMD NODE_ENV=production yarn start

FROM openneuro/node AS web

WORKDIR /srv/packages/openneuro-app
RUN yarn tsc -b && NODE_OPTIONS=--max_old_space_size=4096 yarn build && cp maintenance.html src/dist/client

CMD NODE_ENV=production yarn node dist/ssr.js

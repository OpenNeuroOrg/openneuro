FROM openneuro/node AS web

WORKDIR /srv/packages/openneuro-app
RUN yarn tsc -b && yarn build && cp maintenance.html src/dist/client

CMD source ./vite-env.sh && NODE_ENV=production node dist/ssr.js

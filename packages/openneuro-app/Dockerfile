FROM openneuro/node AS app

WORKDIR /srv/packages/openneuro-app
RUN yarn tsc -b && NODE_OPTIONS=--max_old_space_size=4096 yarn build && cp maintenance.html src/dist/client

FROM nginx:alpine AS web

COPY --from=app /srv/packages/openneuro-app/dist /srv/app/dist
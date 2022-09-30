FROM openneuro/node AS app

WORKDIR /srv/packages/openneuro-app
RUN NODE_OPTIONS=--max_old_space_size=8192 yarn build && cp maintenance.html src/dist && cp src/assets/favicon.ico src/dist

FROM nginx:alpine AS web

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=app /srv/packages/openneuro-app/src/dist /srv/app/dist

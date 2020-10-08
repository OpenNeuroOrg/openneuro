FROM openneuro/node AS app

WORKDIR /srv/packages/openneuro-app
RUN yarn build && cp maintenance.html dist/

FROM nginx:alpine AS web
COPY --from=app /srv/packages/openneuro-app/dist /srv/app/dist
COPY --from=app /srv/packages/openneuro-app/nginx.conf /etc/nginx/conf.d/default.conf

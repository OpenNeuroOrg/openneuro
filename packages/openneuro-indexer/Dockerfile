FROM openneuro/node AS build

WORKDIR /srv/packages/openneuro-indexer
CMD ["node", "-r", "/srv/.pnp.cjs", "/srv/packages/openneuro-indexer/dist/index.js"]
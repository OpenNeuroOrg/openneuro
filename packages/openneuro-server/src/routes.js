// dependencies ------------------------------------

import express from 'express'
import * as users from './handlers/users'
import * as datalad from './handlers/datalad'
import * as download from './handlers/download.js'
import * as comments from './handlers/comments'
import { clientConfig } from './handlers/config.js'
import * as subscriptions from './handlers/subscriptions'
import verifyUser from './libs/authentication/verifyUser.js'
import * as google from './libs/authentication/google.js'
import * as orcid from './libs/authentication/orcid.js'
import * as globus from './libs/authentication/globus.js'
import * as jwt from './libs/authentication/jwt.js'
import * as auth from './libs/authentication/states.js'
import * as doi from './handlers/doi'
import { sitemapHandler } from './handlers/sitemap.js'

const routes = [
  // Health check --------------------------------
  {
    method: 'get',
    url: '/',
    handler: (req, res) => {
      res.sendStatus(200)
    },
  },
  // React config --------------------------------
  {
    method: 'get',
    url: '/config.json',
    handler: clientConfig,
  },
  // users ---------------------------------------
  {
    method: 'get',
    url: '/users/self',
    middleware: [jwt.authenticate, auth.authenticated],
    handler: verifyUser,
  },

  // comments --------------------------------------

  {
    method: 'post',
    url: '/comments/reply/:commentId/:userId',
    handler: comments.reply,
  },

  // subscriptions ----------------------------------------

  {
    method: 'get',
    url: '/subscriptions/:datasetId',
    handler: subscriptions.getSubscriptions,
  },
  {
    method: 'get',
    url: '/subscriptions/:datasetId/:userId',
    handler: subscriptions.checkUserSubscription,
  },
  {
    method: 'post',
    url: '/subscriptions/:datasetId',
    middleware: [jwt.authenticate, auth.authenticated],
    handler: subscriptions.create,
  },
  {
    method: 'delete',
    url: '/subscriptions/:datasetId/:userId',
    middleware: [jwt.authenticate, auth.authenticated],
    handler: subscriptions.deleteSubscription,
  },
  {
    method: 'delete',
    url: '/subscriptions/:datasetId',
    middleware: [jwt.authenticate, auth.authenticated],
    handler: subscriptions.deleteAll,
  },

  // dataset doi ----------------------------------------
  {
    method: 'post',
    url: '/doi/:datasetId/:snapshotId',
    middleware: [jwt.authenticate, auth.authenticated],
    handler: doi.createSnapshotDoi,
  },
  {
    method: 'get',
    url: '/doi/:datasetId/:snapshotId',
    handler: doi.getDoi,
  },

  // generate CLI API keys ------------------------------
  {
    method: 'post',
    url: '/keygen',
    middleware: [jwt.authenticate, auth.authenticated],
    handler: users.createAPIKey,
  },

  // file routes
  {
    method: 'get',
    url: '/datasets/:datasetId/files/:filename',
    handler: datalad.getFile,
  },
  {
    method: 'get',
    url: '/datasets/:datasetId/snapshots/:snapshotId/files/:filename',
    handler: datalad.getFile,
  },

  // Download routes
  {
    method: 'get',
    url: '/datasets/:datasetId/download',
    middleware: [jwt.authenticate, auth.optional],
    handler: download.datasetDownload,
  },
  {
    method: 'get',
    url: '/datasets/:datasetId/snapshots/:snapshotId/download',
    middleware: [jwt.authenticate, auth.optional],
    handler: download.snapshotDownload,
  },

  // Authentication routes

  // google
  {
    method: 'get',
    url: '/auth/google',
    handler: google.requestAuth,
  },
  {
    method: 'get',
    url: '/auth/google/callback',
    middleware: [google.authCallback],
    handler: jwt.authSuccessHandler,
  },

  // orcid
  {
    method: 'get',
    url: '/auth/orcid',
    handler: orcid.requestAuth,
  },
  {
    method: 'get',
    url: '/auth/orcid/callback',
    middleware: [orcid.authCallback],
    handler: jwt.authSuccessHandler,
  },

  // globus
  {
    method: 'get',
    url: '/auth/globus',
    handler: globus.requestAuth,
  },
  {
    method: 'get',
    url: '/auth/globus/callback',
    middleware: [globus.authCallback],
    handler: jwt.authSuccessHandler,
  },
  // sitemap
  {
    method: 'get',
    url: '/sitemap',
    handler: sitemapHandler,
  },
]

// initialize routes -------------------------------

const router = express.Router()

for (const route of routes) {
  const arr = route.hasOwnProperty('middleware') ? route.middleware : []
  arr.unshift(route.url)
  arr.push(route.handler)
  router[route.method](...arr)
}

// export ------------------------------------------

export default router

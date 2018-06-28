// dependencies ------------------------------------

import express from 'express'
import users from './handlers/users'
import awsJobs from './handlers/awsJobs'
import eventLogs from './handlers/eventLogs'
import validation from './handlers/validation'
import datasets from './handlers/datasets'
import stars from './handlers/stars'
import * as datalad from './handlers/datalad'
import * as openfmri from './handlers/openfmri'
import * as download from './handlers/download.js'
import comments from './handlers/comments'
import * as subscriptions from './handlers/subscriptions'
import verifyUser from './libs/authentication/verifyUser.js'
import * as google from './libs/authentication/google.js'
import * as orcid from './libs/authentication/orcid.js'
import * as globus from './libs/authentication/globus.js'
import * as jwt from './libs/authentication/jwt.js'
import * as auth from './libs/authentication/states.js'
import schema from './libs/schema'
import schemas from './schemas'
import doi from './handlers/doi'

import fileUpload from 'express-fileupload'

const routes = [
  // users ---------------------------------------
  {
    method: 'get',
    url: '/users/self',
    middleware: [jwt.authenticate, auth.authenticated],
    handler: verifyUser,
  },
  {
    method: 'get',
    url: '/users/orcid/refresh',
    handler: users.refreshORCIDToken,
  },
  {
    method: 'get',
    url: '/users/orcid',
    handler: users.getORCIDProfile,
  },
  {
    method: 'post',
    url: '/users',
    middleware: [schema.validateBody(schemas.user.new)],
    handler: users.create,
  },
  {
    method: 'post',
    url: '/users/blacklist',
    middleware: [
      schema.validateBody(schemas.user.blacklisted),
      jwt.authenticate,
      auth.superuser,
    ],
    handler: users.blacklist,
  },
  {
    method: 'get',
    url: '/users/blacklist',
    middleware: [jwt.authenticate, auth.superuser],
    handler: users.getBlacklist,
  },
  {
    method: 'delete',
    url: '/users/blacklist/:id',
    middleware: [jwt.authenticate, auth.superuser],
    handler: users.unBlacklist,
  },

  // validation ----------------------------------

  {
    method: 'post',
    url: '/datasets/:datasetId/validate',
    middleware: [jwt.authenticate, auth.authenticated],
    handler: validation.validate,
  },

  // analytics -----------------------------------

  {
    method: 'get',
    url: '/analytics/:datasetId?',
    middleware: [jwt.authenticate, auth.optional],
    handler: datasets.analytics,
  },

  // jobs ----------------------------------------

  {
    method: 'get',
    url: '/apps',
    handler: awsJobs.describeJobDefinitions,
  },
  {
    method: 'post',
    url: '/jobs/definitions',
    middleware: [
      jwt.authenticate,
      auth.superuser,
      schema.validateBody(schemas.job.definition),
    ],
    handler: awsJobs.createJobDefinition,
  },
  {
    method: 'delete',
    url: '/jobs/definitions/:appId',
    middleware: [jwt.authenticate, auth.superuser],
    handler: awsJobs.deleteJobDefinition,
  },
  {
    method: 'post',
    url: '/datasets/:datasetId/jobs',
    middleware: [
      jwt.authenticate,
      auth.authenticated,
      auth.datasetAccess,
      auth.submitJobAccess,
      schema.validateBody(schemas.job.submit),
    ],
    handler: awsJobs.submitJob,
  },
  {
    method: 'post',
    url: '/datasets/jobsupload',
    middleware: [fileUpload(), jwt.authenticate, auth.optional],
    handler: awsJobs.parameterFileUpload,
  },
  {
    method: 'get',
    url: '/datasets/:datasetId/jobs',
    middleware: [jwt.authenticate, auth.optional, auth.datasetAccess],
    handler: awsJobs.getDatasetJobs,
  },
  {
    method: 'delete',
    url: '/datasets/:datasetId/jobs',
    middleware: [jwt.authenticate, auth.authenticated, auth.datasetAccess],
    handler: awsJobs.deleteDatasetJobs,
  },
  {
    method: 'get',
    url: '/datasets/:datasetId/jobs/:jobId',
    middleware: [jwt.authenticate, auth.authenticated, auth.datasetAccess],
    handler: awsJobs.getJob,
  },
  {
    method: 'delete',
    url: '/datasets/:datasetId/jobs/:jobId',
    middleware: [
      jwt.authenticate,
      auth.authenticated,
      auth.datasetAccess,
      auth.deleteJobAccess,
    ],
    handler: awsJobs.deleteJob,
  },
  {
    method: 'put',
    url: '/datasets/:datasetId/jobs/:jobId',
    middleware: [jwt.authenticate, auth.authenticated, auth.datasetAccess],
    handler: awsJobs.cancelJob,
  },
  {
    method: 'post',
    url: '/datasets/:datasetId/jobs/:jobId/retry',
    middleware: [
      jwt.authenticate,
      auth.authenticated,
      auth.datasetAccess,
      auth.rerunJobAccess,
      auth.submitJobAccess,
    ],
    handler: awsJobs.retry,
  },
  {
    method: 'get',
    url: '/datasets/:datasetId/jobs/:jobId/results/ticket',
    middleware: [jwt.authenticate, auth.authenticated, auth.datasetAccess],
    handler: awsJobs.getDownloadTicket,
  },
  {
    method: 'get',
    url: '/jobs',
    middleware: [jwt.authenticate, auth.optional],
    handler: awsJobs.getJobs,
  },
  {
    method: 'get',
    url: '/jobs/:jobId/results/:fileName',
    // middleware: [
    //     auth.ticket
    // ],
    handler: awsJobs.downloadAllS3,
  },
  {
    method: 'get',
    url: '/jobs/:jobId/logs',
    handler: awsJobs.downloadJobLogs,
  },
  {
    method: 'get',
    url: '/logs/:app/:jobId/:taskArn',
    handler: awsJobs.getLogstream,
  },
  {
    method: 'get',
    url: '/logs/:app/:jobId/:taskArn/raw',
    handler: awsJobs.getLogstreamRaw,
  },
  {
    method: 'get',
    url: '/eventlogs',
    middleware: [jwt.authenticate, auth.superuser],
    handler: eventLogs.getEventLogs,
  },

  // comments --------------------------------------
  {
    method: 'get',
    url: '/comments/:datasetId',
    handler: comments.getComments,
  },

  {
    method: 'post',
    url: '/comments/:datasetId',
    middleware: [jwt.authenticate, auth.authenticated],
    handler: comments.create,
  },

  {
    method: 'post',
    url: '/comments/:datasetId/:commentId',
    middleware: [jwt.authenticate, auth.authenticated, auth.commentAccess],
    handler: comments.update,
  },

  {
    method: 'post',
    url: '/comments/reply/:commentId/:userId',
    handler: comments.reply,
  },

  {
    method: 'delete',
    url: '/comments/:commentId',
    middleware: [jwt.authenticate, auth.authenticated, auth.commentAccess],
    handler: comments.delete,
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

  // dataset stars ----------------------------------------

  {
    method: 'get',
    url: '/stars/:datasetId',
    handler: stars.getStars,
  },
  {
    method: 'post',
    url: '/stars/:datasetId',
    middleware: [jwt.authenticate, auth.authenticated],
    handler: stars.add,
  },
  {
    method: 'delete',
    url: '/stars/:datasetId/:userId',
    middleware: [jwt.authenticate, auth.authenticated],
    handler: stars.delete,
  },

  // dataset doi ----------------------------------------
  {
    method: 'post',
    url: '/doi/:datasetId',
    middleware: [jwt.authenticate, auth.authenticated],
    handler: doi.createSnapshotDoi,
  },
  {
    method: 'get',
    url: '/doi/:datasetId',
    handler: doi.getDoi,
  },

  // generate CLI API keys ------------------------------
  {
    method: 'post',
    url: '/keygen',
    middleware: [jwt.authenticate, auth.authenticated],
    handler: users.createAPIKey,
  },

  // DataLad dataset routes
  {
    method: 'post',
    url: '/datasets',
    middleware: [jwt.authenticate, auth.authenticated, auth.datasetAccess],
    handler: datalad.createDataset,
  },
  {
    method: 'delete',
    url: '/datasets/:datasetId',
    middleware: [jwt.authenticate, auth.authenticated, auth.datasetAccess],
    handler: datalad.deleteDataset,
  },
  {
    method: 'post',
    url: '/datasets/:datasetId/snapshots/:snapshotId',
    middleware: [jwt.authenticate, auth.authenticated, auth.datasetAccess],
    handler: datalad.createSnapshot,
  },
  {
    method: 'post',
    url: '/datasets/:datasetId/publish',
    middleware: [jwt.authenticate, auth.authenticated, auth.datasetAccess],
    handler: datalad.publishDataset,
  },
  {
    method: 'delete',
    url: '/datasets/:datasetId/publish',
    middleware: [jwt.authenticate, auth.authenticated, auth.datasetAccess],
    handler: datalad.unpublishDataset,
  },

  // OpenFMRI API routes
  {
    method: 'get',
    url: '/openfmri/dataset/api/:datasetId',
    handler: openfmri.getDataset,
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
    handler: download.datasetDownload,
  },
  {
    method: 'get',
    url: '/datasets/:datasetId/snapshots/:snapshotId/download',
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
    url: '/users/signin/orcid',
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
]

// initialize routes -------------------------------

const router = express.Router()

for (const route of routes) {
  let arr = route.hasOwnProperty('middleware') ? route.middleware : []
  arr.unshift(route.url)
  arr.push(route.handler)
  router[route.method].apply(router, arr)
}

// export ------------------------------------------

export default router

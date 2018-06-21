// dependencies ------------------------------------

import express from 'express'
import config from './config'
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
import subscriptions from './handlers/subscriptions'
import * as google from './libs/authentication/google.js'
import auth from './libs/auth'
import scitran from './libs/scitran'
import schema from './libs/schema'
import schemas from './schemas'
import doi from './handlers/doi'

import fileUpload from 'express-fileupload'

const baseRoutes = [
  // users ---------------------------------------

  {
    method: 'get',
    url: '/users/self',
    handler: scitran.verifyUser,
  },
  {
    method: 'get',
    url: '/users/signin/orcid',
    handler: users.validateORCIDToken,
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
    middleware: [schema.validateBody(schemas.user.blacklisted), auth.superuser],
    handler: users.blacklist,
  },
  {
    method: 'get',
    url: '/users/blacklist',
    middleware: [auth.superuser],
    handler: users.getBlacklist,
  },
  {
    method: 'delete',
    url: '/users/blacklist/:id',
    middleware: [auth.superuser],
    handler: users.unBlacklist,
  },

  // validation ----------------------------------

  {
    method: 'post',
    url: '/datasets/:datasetId/validate',
    middleware: [auth.user],
    handler: validation.validate,
  },

  // analytics -----------------------------------

  {
    method: 'get',
    url: '/analytics/:datasetId?',
    middleware: [auth.optional],
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
    middleware: [auth.superuser, schema.validateBody(schemas.job.definition)],
    handler: awsJobs.createJobDefinition,
  },
  {
    method: 'delete',
    url: '/jobs/definitions/:appId',
    middleware: [auth.superuser],
    handler: awsJobs.deleteJobDefinition,
  },
  {
    method: 'post',
    url: '/datasets/:datasetId/jobs',
    middleware: [
      auth.datasetAccess(),
      auth.submitJobAccess,
      schema.validateBody(schemas.job.submit),
    ],
    handler: awsJobs.submitJob,
  },
  {
    method: 'post',
    url: '/datasets/jobsupload',
    middleware: [fileUpload(), auth.optional],
    handler: awsJobs.parameterFileUpload,
  },
  {
    method: 'get',
    url: '/datasets/:datasetId/jobs',
    middleware: [auth.datasetAccess({ optional: true })],
    handler: awsJobs.getDatasetJobs,
  },
  {
    method: 'delete',
    url: '/datasets/:datasetId/jobs',
    middleware: [auth.datasetAccess()],
    handler: awsJobs.deleteDatasetJobs,
  },
  {
    method: 'get',
    url: '/datasets/:datasetId/jobs/:jobId',
    middleware: [auth.datasetAccess()],
    handler: awsJobs.getJob,
  },
  {
    method: 'delete',
    url: '/datasets/:datasetId/jobs/:jobId',
    middleware: [auth.datasetAccess(), auth.deleteJobAccess],
    handler: awsJobs.deleteJob,
  },
  {
    method: 'put',
    url: '/datasets/:datasetId/jobs/:jobId',
    middleware: [auth.datasetAccess()],
    handler: awsJobs.cancelJob,
  },
  {
    method: 'post',
    url: '/datasets/:datasetId/jobs/:jobId/retry',
    middleware: [
      auth.datasetAccess(),
      auth.rerunJobAccess,
      auth.submitJobAccess,
    ],
    handler: awsJobs.retry,
  },
  {
    method: 'get',
    url: '/datasets/:datasetId/jobs/:jobId/results/ticket',
    middleware: [auth.datasetAccess()],
    handler: awsJobs.getDownloadTicket,
  },
  {
    method: 'get',
    url: '/jobs',
    middleware: [auth.optional],
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
    middleware: [auth.superuser],
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
    middleware: [auth.user],
    handler: comments.create,
  },

  {
    method: 'post',
    url: '/comments/:datasetId/:commentId',
    middleware: [auth.deleteCommentAccess],
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
    middleware: [auth.deleteCommentAccess],
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
    middleware: [auth.user],
    handler: subscriptions.create,
  },
  {
    method: 'delete',
    url: '/subscriptions/:datasetId/:userId',
    middleware: [auth.user],
    handler: subscriptions.delete,
  },
  {
    method: 'delete',
    url: '/subscriptions/:datasetId',
    middleware: [auth.user],
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
    middleware: [auth.user],
    handler: stars.add,
  },
  {
    method: 'delete',
    url: '/stars/:datasetId/:userId',
    middleware: [auth.user],
    handler: stars.delete,
  },

  // dataset doi ----------------------------------------
  {
    method: 'post',
    url: '/doi/:datasetId',
    middleware: [auth.user],
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
    middleware: [auth.user],
    handler: users.createAPIKey,
  },
]

const scitranRoutes = [
  // datasets ------------------------------------
  // Note: most dataset interactions are sent directly to Scitran.
  // These manage those that need to be modified or proxied.
  {
    method: 'post',
    url: '/datasets',
    handler: datasets.create,
  },
  {
    method: 'post',
    url: '/datasets/:datasetId/snapshot',
    handler: datasets.snapshot,
  },
  {
    method: 'post',
    url: '/datasets/:datasetId/permissions',
    handler: datasets.share,
  },
]

// These routes are enabled with the DataLad backend
const dataladRoutes = [
  {
    method: 'post',
    url: '/datasets',
    handler: datalad.createDataset,
  },
  {
    method: 'delete',
    url: '/datasets/:datasetId',
    handler: datalad.deleteDataset,
  },
  {
    method: 'post',
    url: '/datasets/:datasetId/snapshots/:snapshotId',
    handler: datalad.createSnapshot,
  },
  {
    method: 'post',
    url: '/datasets/:datasetId/publish',
    handler: datalad.publishDataset,
  },
  {
    method: 'delete',
    url: '/datasets/:datasetId/publish',
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
  {
    method: 'get',
    url: '/auth/google',
    handler: google.requestAuth,
  },
  {
    method: 'get',
    url: '/auth/google/callback',
    handler: google.authCallback,
  },
]

// initialize routes -------------------------------

const router = express.Router()
// TODO - remove this once SciTran backend is no longer in use
const routes = config.datalad.enabled
  ? baseRoutes.concat(dataladRoutes)
  : baseRoutes.concat(scitranRoutes)

for (const route of routes) {
  let arr = route.hasOwnProperty('middleware') ? route.middleware : []
  arr.unshift(route.url)
  arr.push(route.handler)
  router[route.method].apply(router, arr)
}

// export ------------------------------------------

export default router

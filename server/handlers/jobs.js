/*eslint no-console: ["error", { allow: ["log"] }] */

// dependencies ------------------------------------------------------------

import aws from '../libs/aws'
import agave from '../libs/agave'
import scitran from '../libs/scitran'
import mongo from '../libs/mongo'
import async from 'async'
import crypto from 'crypto'
import notifications from '../libs/notifications'
import { ObjectID } from 'mongodb'

let c = mongo.collections

// handlers ----------------------------------------------------------------

/**
 * Jobs
 *
 * Handlers for job actions.
 */
let handlers = {
  /**
     * GET Apps - original
     */
  getApps(req, res, next) {
    agave.api.listApps((err, resp) => {
      if (err) {
        return next(err)
      }
      let apps = []
      async.each(
        resp.body.result,
        (app, cb) => {
          agave.api.getApp(app.id, (err, resp2) => {
            if (resp2.body && resp2.body.result) {
              apps.push(resp2.body.result)
            }
            cb()
          })
        },
        () => {
          res.send(apps)
        },
      )
    })
  },

  /**
     * POST Job - original
     */
  postJob(req, res, next) {
    let job = req.body
    scitran.downloadSymlinkDataset(
      job.snapshotId,
      (err, hash) => {
        job.datasetHash = hash
        job.parametersHash = crypto
          .createHash('md5')
          .update(JSON.stringify(job.parameters))
          .digest('hex')

        c.crn.jobs.findOne(
          {
            appId: job.appId,
            datasetHash: job.datasetHash,
            parametersHash: job.parametersHash,
            snapshotId: job.snapshotId,
          },
          {},
          (err, existingJob) => {
            if (err) {
              return next(err)
            }
            if (existingJob) {
              // allow retrying failed jobs
              if (existingJob.agave && existingJob.agave.status === 'FAILED') {
                handlers.retry(
                  { params: { jobId: existingJob.jobId } },
                  res,
                  next,
                )
                return
              }
              let error = new Error(
                'A job with the same dataset and parameters has already been run.',
              )
              error.http_code = 409
              res.status(409).send({
                message:
                  'A job with the same dataset and parameters has already been run.',
              })
              return
            }

            agave.submitJob(job, (err, resp) => {
              if (err) {
                return next(err)
              }
              res.send(resp)
            })
          },
        )
      },
      { snapshot: true },
    )
  },

  /**
     * Retry
     */
  retry(req, res, next) {
    let jobId = req.params.jobId

    // find job
    c.crn.jobs.findOne({ jobId }, {}, (err, job) => {
      if (err) {
        return next(err)
      }
      if (!job) {
        let error = new Error('Could not find job.')
        error.http_code = 404
        return next(error)
      }
      if (job.agave.status && job.agave.status === 'FINISHED') {
        let error = new Error(
          'A job with the same dataset and parameters has already successfully finished.',
        )
        error.http_code = 409
        return next(error)
      }
      if (job.agave.status && job.agave.status !== 'FAILED') {
        let error = new Error(
          'A job with the same dataset and parameters is currently running.',
        )
        error.http_code = 409
        return next(error)
      }

      // re-submit job with old job data
      agave.submitJob(job, (err, resp) => {
        if (err) {
          return next(err)
        } else {
          // delete old job
          c.crn.jobs.removeOne({ jobId }, {}, err => {
            if (err) {
              return next(err)
            }
            res.send(resp)
          })
        }
      })
    })
  },

  /**
     *  GET Dataset Jobs
     */
  getDatasetJobs(req, res, next) {
    let snapshot =
      req.query.hasOwnProperty('snapshot') && req.query.snapshot == 'true'
    let datasetId = req.params.datasetId
    let user = req.user
    let hasAccess = req.hasAccess

    let query = snapshot ? { snapshotId: datasetId } : { datasetId }
    query.deleted = { $ne: true }
    c.crn.jobs.find(query).toArray((err, jobs) => {
      if (err) {
        return next(err)
      }

      const userPromises = jobs.map(job => {
        return new Promise(resolve => {
          scitran.getUser(job.userId, (err, response) => {
            job.userMetadata = {}
            if (response.statusCode == 200) {
              job.userMetadata = response.body
            }
            resolve()
          })
        })
      })

      Promise.all(userPromises).then(() => {
        for (let job of jobs) {
          if (job.analysis.logstreams) {
            let streamNameVersion = aws.cloudwatch.streamNameVersion(job)
            job.analysis.logstreams = job.analysis.logstreams.map(stream => {
              // Fix legacy internal logstream values and adapt for changes in Batch names
              return aws.cloudwatch.formatLegacyLogStream(
                stream,
                streamNameVersion,
              )
            })
          }
        }
        if (snapshot) {
          if (!hasAccess) {
            let error = new Error(
              'You do not have access to view jobs for this dataset.',
            )
            error.http_code = 403
            return next(error)
          }
          // remove user ID on public requests
          if (!user) {
            for (let job of jobs) {
              delete job.userId
            }
          }
          res.send(jobs)
        } else {
          scitran.getProjectSnapshots(datasetId, (err, resp) => {
            let snapshots = resp.body
            let filteredJobs = []
            for (let job of jobs) {
              for (let snapshot of snapshots) {
                if (
                  (snapshot.public || hasAccess) &&
                  snapshot._id === job.snapshotId
                ) {
                  if (!user) {
                    delete job.userId
                  }
                  filteredJobs.push(job)
                }
              }
            }
            res.send(filteredJobs)
          })
        }
      })
    })
  },

  /**
     * POST Results
     */
  postResults(req, res) {
    let jobId = req.params.jobId
    c.crn.jobs.findOne({ jobId }, {}, (err, job) => {
      if (
        !job ||
        job.agave.status === 'FAILED' ||
        job.agave.status === 'FINISHED'
      ) {
        // occasionally result webhooks callback before the
        // original job submission is saved or after the job
        // is complete. in these cases do nothing.
        res.send({})
      } else if (req.body.status === job.agave.status) {
        res.send(job)
      } else if (
        req.body.status === 'FINISHED' ||
        req.body.status === 'FAILED'
      ) {
        agave.getOutputs(jobId, (results, logs) => {
          c.crn.jobs
            .updateOne(
              { jobId },
              { $set: { agave: req.body, results, logs } },
              {},
            )
            .then((err, result) => {
              if (err) {
                res.send(err)
              } else {
                res.send(result)
              }
              job.agave = req.body
              job.results = results

              notifications.jobComplete(job)
            })
        })
      } else {
        c.crn.jobs.updateOne(
          { jobId },
          { $set: { agave: req.body } },
          {},
          (err, result) => {
            if (err) {
              res.send(err)
            } else {
              res.send(result)
            }
          },
        )
      }
    })
  },

  /**
     * GET Job
     */
  getJob(req, res) {
    let jobId = req.params.jobId
    c.crn.jobs.findOne({ jobId }, {}, (err, job) => {
      let status = job.agave.status

      // check if job is already known to be completed
      if (
        (status === 'FINISHED' && job.results && job.results.length > 0) ||
        status === 'FAILED'
      ) {
        res.send(job)
      } else {
        agave.api.getJob(jobId, (err, resp) => {
          // check status
          if (
            resp.body.status === 'error' &&
            resp.body.message.indexOf('No job found with job id') > -1
          ) {
            job.agave.status = 'FAILED'
            c.crn.jobs.updateOne(
              { jobId },
              { $set: { agave: job.agave } },
              {},
              () => {
                res.send({
                  agave: resp.body.result,
                  snapshotId: job.snapshotId,
                })
                notifications.jobComplete(job)
              },
            )
          } else if (
            resp.body &&
            resp.body.result &&
            (resp.body.result.status === 'FINISHED' ||
              resp.body.result.status === 'FAILED')
          ) {
            job.agave = resp.body.result
            agave.getOutputs(jobId, (results, logs) => {
              c.crn.jobs.updateOne(
                { jobId },
                { $set: { agave: resp.body.result, results, logs } },
                {},
                err => {
                  if (err) {
                    res.send(err)
                  } else {
                    res.send({
                      agave: resp.body.result,
                      results,
                      logs,
                      snapshotId: job.snapshotId,
                    })
                  }
                  job.agave = resp.body.result
                  job.results = results
                  job.logs = logs
                  if (status !== 'FINISHED') {
                    notifications.jobComplete(job)
                  }
                },
              )
            })
          } else if (
            resp.body &&
            resp.body.result &&
            job.agave.status !== resp.body.result.status
          ) {
            job.agave = resp.body.result
            c.crn.jobs.updateOne(
              { jobId },
              { $set: { agave: resp.body.result } },
              {},
              err => {
                if (err) {
                  res.send(err)
                } else {
                  res.send({
                    agave: resp.body.result,
                    datasetId: job.datasetId,
                    snapshotId: job.snapshotId,
                    jobId: jobId,
                  })
                }
              },
            )
          } else {
            res.send({
              agave: resp.body.result,
              datasetId: job.datasetId,
              snapshotId: job.snapshotId,
              jobId: jobId,
            })
          }
        })
      }
    })
  },

  getJobs(req, res) {
    let reqAll = false
    let reqPublic = req.query.public === 'true'
    const includeResults = req.query.results === 'true'
    if (req.isSuperUser) {
      reqAll = req.query.all === 'true'
      // If all jobs are requested, skip the public query
      if (reqAll) {
        reqPublic = false
      }
    }
    let jobsQuery = {}
    // Optionally select by app
    if (req.query.appName) {
      jobsQuery['jobName'] = req.query.appName
    }
    if (req.query.status) {
      jobsQuery['analysis.status'] = req.query.status
    }
    jobsQuery.deleted = { $ne: true }
    let jobsResults
    if (includeResults) {
      jobsResults = c.crn.jobs.find(jobsQuery).sort({ 'analysis.created': -1 })
    } else {
      const jobsProjection = { results: 0, 'analysis.logstreams': 0 }
      jobsResults = c.crn.jobs
        .find(jobsQuery, jobsProjection)
        .sort({ 'analysis.created': -1 })
    }
    jobsResults.toArray((err, jobs) => {
      if (err) {
        res.send(err)
        return
      }

      // tie user metadata to the jobs
      const userPromises = jobs.map(job => {
        return new Promise(resolve => {
          scitran.getUser(job.userId, (err, response) => {
            job.userMetadata = {}
            if (response.statusCode == 200) {
              job.userMetadata = response.body
            }
            resolve()
          })
        })
      })
      Promise.all(userPromises).then(() => {
        console.log('JOB AFTER PROMISE:', jobs)

        // store request metadata
        let availableApps = {}

        // filter jobs by permissions
        let filteredJobs = []

        if (reqPublic) {
          async.each(
            jobs,
            (job, cb) => {
              c.scitran.project_snapshots.findOne(
                { _id: ObjectID(job.snapshotId) },
                {},
                (err, snapshot) => {
                  if (snapshot && snapshot.public === true) {
                    buildMetadata(job)
                    filteredJobs.push(job)
                    cb()
                  } else {
                    cb()
                  }
                },
              )
            },
            () => {
              res.send({
                availableApps: reMapMetadata(availableApps),
                jobs: filteredJobs,
              })
            },
          )
        } else {
          for (let job of jobs) {
            if (reqAll || req.user === job.userId) {
              buildMetadata(job)
              filteredJobs.push(job)
            }
          }
          res.send({
            availableApps: reMapMetadata(availableApps),
            jobs: filteredJobs,
          })
        }

        function buildMetadata(job) {
          if (!availableApps.hasOwnProperty(job.appLabel)) {
            availableApps[job.appLabel] = { versions: {} }
            availableApps[job.appLabel].versions[job.appVersion] = job.appId
          } else if (
            !availableApps[job.appLabel].versions.hasOwnProperty(job.appVersion)
          ) {
            availableApps[job.appLabel].versions[job.appVersion] = job.appId
          }
        }

        function reMapMetadata(apps) {
          let remapped = []
          for (let app in apps) {
            let tempApp = { label: app, versions: [] }
            for (let version in apps[app].versions) {
              tempApp.versions.push({
                version,
                id: apps[app].versions[version],
              })
            }
            remapped.push(tempApp)
          }
          return remapped
        }
      })
    })
  },

  /**
     * GET Download Ticket
     */
  getDownloadTicket(req, res) {
    let jobId = req.params.jobId
    // form ticket
    let ticket = {
      type: 'download',
      userId: req.user,
      jobId: jobId,
      fileName: 'all',
      created: new Date(),
    }

    res.send(ticket)
  },

  /**
     * DELETE Dataset Jobs
     *
     * Takes a dataset ID url parameter and deletes all jobs for that dataset.
     */
  deleteDatasetJobs(req, res, next) {
    let datasetId = req.params.datasetId

    scitran.getProject(datasetId, (err, resp) => {
      if (resp.statusCode == 400) {
        let error = new Error('Bad request')
        error.http_code = 400
        return next(error)
      }
      if (resp.statusCode == 404) {
        let error = new Error('No dataset found')
        error.http_code = 404
        return next(error)
      }

      let hasPermission
      if (!req.user) {
        hasPermission = false
      } else {
        for (let permission of resp.body.permissions) {
          if (req.user === permission._id && permission.access === 'admin') {
            hasPermission = true
            break
          }
        }
      }
      if (!resp.body.public && hasPermission) {
        c.crn.jobs.deleteMany({ datasetId }, [], (err, doc) => {
          if (err) {
            return next(err)
          }
          res.send({
            message:
              doc.result.n +
              ' job(s) have been deleted for dataset ' +
              datasetId,
          })
        })
      } else {
        let message = resp.body.public
          ? "You don't have permission to delete results from public datasets"
          : "You don't have permission to delete jobs from this dataset."
        let error = new Error(message)
        error.http_code = 403
        return next(error)
      }
    })
  },
}

export default handlers

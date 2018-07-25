/*eslint no-console: ["error", { allow: ["log"] }] */
// dependencies ------------------------------------------------------------
import crypto from 'crypto'
import aws from '../libs/aws'
import scitran from '../libs/scitran'
import mongo from '../libs/mongo'
import { ObjectID } from 'mongodb'
import yazl from 'yazl'
import S3StreamDownload from 's3-stream-download'
import config from '../config'
import async from 'async'
import bidsId from '../libs/bidsId.js'
import { queue } from '../libs/queue'

let c = mongo.collections

//Job Polling

// handlers ----------------------------------------------------------------

/**
 * Jobs
 *
 * Handlers for job actions.
 */
let handlers = {
  /**
   * Create Job Definition
   */
  createJobDefinition(req, res, next) {
    let jobDef = Object.assign({}, req.body)

    aws.batch.registerJobDefinition(jobDef, (err, data) => {
      if (err) {
        console.log(err)
        return next(err)
      } else {
        let extendeJobDef = data
        extendeJobDef.parameters = req.body.parameters || {}
        extendeJobDef.descriptions = req.body.descriptions || {}
        extendeJobDef.parametersMetadata = req.body.parametersMetadata || {}
        extendeJobDef.analysisLevels = req.body.analysisLevels || []
        c.crn.jobDefinitions.insertOne(extendeJobDef, err => {
          if (err) {
            //TODO -- error handling? make response dependant on inserting document?
          }
        })
        // can go ahead and respond to client without waiting on mongo insert
        res.send(data)
      }
    })
  },

  /**
   * Delete App Definition
   */
  deleteJobDefinition(req, res, next) {
    let appId = req.params.appId
    let appKeys = appId.split(':')
    let name = appKeys[0]
    let revision = parseInt(appKeys[1])
    c.crn.jobDefinitions.findOneAndUpdate(
      { jobDefinitionName: name, revision: revision },
      { $set: { deleted: true } },
      {},
      (err, jobDef) => {
        if (err) {
          return next(err)
        } else {
          res.send(jobDef)
        }
      },
    )
  },

  /**
   * Describe Job Definitions
   */
  describeJobDefinitions(req, res, next) {
    //recursive function to handle grabbing all job definitions if more than 100 exist on batch
    let getJobDefinitions = (params, jobDefs, callback) => {
      aws.batch.sdk.describeJobDefinitions(params, (err, data) => {
        if (err) {
          return callback(err)
        }
        jobDefs = jobDefs.concat(data.jobDefinitions)
        if (data.nextToken) {
          params.nextToken = data.nextToken
          getJobDefinitions(params, jobDefs, callback)
        } else {
          callback(null, jobDefs)
        }
      })
    }

    c.crn.jobDefinitions
      .find({}, { jobDefinitionArn: true })
      .toArray((err, appDefs) => {
        let arns = appDefs.map(app => {
          return app.jobDefinitionArn
        })
        getJobDefinitions({ jobDefinitions: arns }, [], (err, jobDefs) => {
          if (err) {
            console.log(err)
            return next(err)
          } else {
            let definitions = {}
            //need to attach job definition descriptions from mongo to job defs returned from AWS batch
            async.each(
              jobDefs,
              (definition, cb) => {
                if (!definitions.hasOwnProperty(definition.jobDefinitionName)) {
                  definitions[definition.jobDefinitionName] = {}
                }
                const query = {
                  jobDefinitionName: definition.jobDefinitionName,
                  jobDefinitionArn: definition.jobDefinitionArn,
                  revision: definition.revision,
                }
                const projection = {
                  descriptions: true,
                  parameters: true,
                  parametersMetadata: true,
                  analysisLevels: true,
                  deleted: true,
                }
                c.crn.jobDefinitions
                  .find(query, projection)
                  .toArray((err, def) => {
                    // there will either be a one element array or an empty array returned
                    let parameters =
                      def.length === 0 || !def[0].parameters
                        ? {}
                        : def[0].parameters
                    let descriptions =
                      def.length === 0 || !def[0].descriptions
                        ? {}
                        : def[0].descriptions
                    let parametersMetadata =
                      def.length === 0 || !def[0].parametersMetadata
                        ? {}
                        : def[0].parametersMetadata
                    let analysisLevels =
                      def.length === 0 || !def[0].analysisLevels
                        ? {}
                        : def[0].analysisLevels
                    let deleted =
                      def.length === 0 || !def[0].deleted
                        ? false
                        : def[0].deleted
                    definition.parameters = parameters
                    definition.descriptions = descriptions
                    definition.parametersMetadata = parametersMetadata
                    definition.analysisLevels = analysisLevels
                    definition.deleted = deleted
                    definitions[definition.jobDefinitionName][
                      definition.revision
                    ] = definition
                    cb()
                  })
              },
              () => {
                res.send(definitions)
              },
            )
          }
        })
      })
  },

  /**
   * Submit Job
   * Inserts a job document into mongo and starts snapshot upload
   * returns job to client
   */
  submitJob(req, res, next) {
    let userId = req.user
    let job = req.body
    aws.batch.prepareAnalysis(job, (err, preparedJob, jobId) => {
      if (err) {
        // Existing job errors are handled
        if (err.existingJob) {
          let existingJob = err.existingJob
          // allow retrying failed jobs
          if (
            existingJob.analysis &&
            existingJob.analysis.status === 'FAILED'
          ) {
            handlers.retry({ params: { jobId: existingJob.jobId } }, res, next)
          } else {
            res.status(409).send({
              message:
                'An analysis with the same dataset and parameters has already been run.',
            })
          }
        }
      } else {
        queue.enqueue(
          'batch',
          'startAnalysis',
          { job: preparedJob, jobId: jobId, userId: userId, retry: false },
          () => {
            // Finish the client request so S3 upload can happen async
            res.send({ jobId: jobId })
          },
        )
      }
    })
  },

  deleteJob(req, res, next) {
    let jobId = req.params.jobId
    c.crn.jobs.update(
      { _id: ObjectID(jobId) },
      { $set: { deleted: true } },
      (err, result) => {
        if (err) return next(err)
        res.send({ data: result })
      },
    )
  },

  parameterFileUpload(req, res, next) {
    let bucket = config.aws.s3.inputsBucket
    let file = req.files.file.data //Buffer
    let hash = crypto
      .createHash('md5')
      .update(file)
      .digest('hex')
    let fileName = req.files.file.name
    let key = hash + '/' + fileName
    let params = {
      Bucket: bucket,
      Body: file,
      Key: key,
    }

    aws.s3.sdk.putObject(params, err => {
      if (err) return next(err)
      let encodedKey = key
        .split('/')
        .map(str => {
          return encodeURIComponent(str)
        })
        .join('/')

      let filePath = '/input/data/' + encodedKey
      res.send({ filePath: filePath })
    })
  },

  /**
   * GET Job
   */
  getJob(req, res, next) {
    let jobId = req.params.jobId //this is the mongo id for the job.

    c.crn.jobs.findOne({ _id: ObjectID(jobId) }, {}, (err, job) => {
      if (err) next(err)

      if (!job) {
        res.status(404).send({ message: 'Job not found.' })
        return
      }

      //Send back job object to client
      // server side polling handles all interactions with Batch now therefore we are not initiating batch polling from client
      res.send(job)
    })
  },

  cancelJob(req, res, next) {
    let jobId = req.params.jobId

    c.crn.jobs.findOneAndUpdate(
      { _id: ObjectID(jobId) },
      { $set: { deleted: true, 'analysis.status': 'CANCELED' } },
      {},
      (err, job) => {
        if (!job.value) {
          res.status(404).send({ message: 'Job not found.' })
          return
        }

        let jobs = job.value.analysis.jobs
        async.each(
          jobs,
          (job, cb) => {
            let params = {
              jobId: job,
              reason: 'User terminated job',
            }
            aws.batch.sdk.terminateJob(params, (err, data) => {
              cb(null, data)
            })
          },
          err => {
            if (err) {
              return next(err)
            }
            res.send(true)
          },
        )
      },
    )
  },

  /**
   * GET File
   * listObjects to find everything in the s3 bucket for a given job
   * stream all files in series(?) to zip
   */
  downloadAllS3(req, res) {
    let jobId = req.params.jobId

    const path = 'all-results' //req.ticket.filePath;
    if (path === 'all-results' || path === 'all-logs') {
      const type = path.replace('all-', '')

      // initialize archive
      let archive = new yazl.ZipFile()

      c.crn.jobs.findOne({ _id: ObjectID(jobId) }, {}, (err, job) => {
        let archiveName =
          job.datasetLabel + '__' + job.analysis.analysisId + '__' + type
        let s3Prefix = job.datasetHash + '/' + job.analysis.analysisId + '/'
        //params to list objects for a job
        let params = {
          Bucket: config.aws.s3.analysisBucket,
          Prefix: s3Prefix,
          StartAfter: s3Prefix,
        }

        // set archive name
        res.attachment(archiveName + '.zip')

        // begin streaming archive
        archive.outputStream.pipe(res)

        aws.s3.getAllS3Objects(params, [], (err, data) => {
          let keysArray = []
          data.forEach(obj => {
            //only include files in results. listObjectsV2 returns keys for directories also so need to filter those out.
            if (!/\/$/.test(obj.name)) {
              keysArray.push(obj.name)
            }
          })

          async.eachSeries(
            keysArray,
            (key, cb) => {
              let objParams = {
                Bucket: config.aws.s3.analysisBucket,
                Key: key,
              }
              let fileName = key
                .split('/')
                .slice(2)
                .join('/')
              const streamOptions = {
                downloadChunkSize: 8 * 1024 * 1024, // 8MB
                concurrentChunks: 2,
                retries: 7,
              }
              // The built in createReadStream blocks the main thread in some situations
              const stream = new S3StreamDownload(
                aws.s3.sdk,
                objParams,
                streamOptions,
              )
              archive.addReadStream(stream, fileName)
              stream.on('end', cb)
            },
            () => {
              archive.end()
            },
          )
        })
      })
    }
  },

  downloadJobLogs(req, res, next) {
    const jobId = req.params.jobId //this will be the mongoId for a given analysis
    const prefix = {}
    let first = true // Flag to skip the space at the start

    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked',
      'Content-Disposition': 'attachment; filename="' + jobId + '.txt"',
    })

    aws.cloudwatch.getLogsByJobId(
      jobId,
      data => {
        let logString = first ? '' : '\n\n'
        first = false
        if (!prefix.hasOwnProperty(data.name)) {
          logString += data.name + ' - exit code ' + data.exitCode + '\n'
          logString += '  Environment variables:\n'
          data.environment.forEach(env => {
            logString += '\t' + env.name + ': ' + env.value + '\n'
          })
          logString += '  Logs:\n'
          prefix[data.name] = true
        }
        data.logs.forEach(log => {
          logString += '\t' + log.timestamp + '\t' + log.message + '\n'
        })
        res.write(logString)
      },
      err => {
        if (err) {
          console.log(err)
          next(err)
        }
        res.end()
      },
    )
  },

  /**
   * Wrapper for getLogstreamRaw that requests the json version
   */
  getLogstream(req, res, next) {
    handlers.getLogstreamRaw(req, res, next, false)
  },

  getLogstreamRaw(req, res, next, raw = true) {
    const appName = req.params.app
    const jobId = req.params.jobId
    const taskArn = req.params.taskArn
    const key = appName + '/' + jobId + '/' + taskArn
    const ct = raw ? 'text/plain' : 'application/json'

    res.writeHead(200, {
      'Content-Type': ct,
      'Transfer-Encoding': 'chunked',
      'Content-Disposition': 'attachment; filename="' + key + '.txt"',
    })

    if (!raw) {
      // Streaming JSON as an array with each element loaded over time
      // One dummy row to allow the callback to insert commas
      res.write('[\n{}')
    }

    aws.cloudwatch
      .getLogs(key, raw, logs => {
        logs.map(log => {
          if (raw) {
            res.write(log.message + '\n')
          } else {
            res.write(',\n' + JSON.stringify(log))
          }
        })
      })
      .then(() => {
        if (!raw) {
          res.write(']\n')
        }
        res.end()
      })
      .catch(err => {
        console.log(err)
        res.end()
      })
  },

  /**
   * Retry a job using existing parameters
   */
  retry(req, res, next) {
    let userId = req.user
    let jobId = req.params.jobId
    let mongoJobId = typeof jobId != 'object' ? ObjectID(jobId) : jobId

    // find job
    c.crn.jobs.findOne({ _id: mongoJobId }, {}, (err, job) => {
      if (err) {
        return next(err)
      }
      if (!job) {
        let error = new Error('Could not find job.')
        error.http_code = 404
        return next(error)
      }
      if (job.analysis.status && job.analysis.status === 'SUCCEEDED') {
        let error = new Error(
          'A job with the same dataset and parameters has already successfully finished.',
        )
        error.http_code = 409
        return next(error)
      }
      if (
        job.analysis.status &&
        job.analysis.status !== 'FAILED' &&
        job.analysis.status !== 'REJECTED'
      ) {
        let error = new Error(
          'A job with the same dataset and parameters is currently running.',
        )
        error.http_code = 409
        return next(error)
      }

      c.crn.jobs.updateOne(
        { _id: mongoJobId },
        {
          $set: {
            'analysis.status': 'RETRYING',
            'analysis.jobs': [],
            'analysis.logstreams': [],
            'analysis.results': [],
            'analysis.batchStatus': [],
            'analysis.created': new Date(),
          },
        },
      )
      queue.enqueue(
        'batch',
        'startAnalysis',
        { job: job, jobId: mongoJobId, userId: userId, retry: true },
        () => {
          // Finish the client request so S3 upload can happen async
          res.send({ jobId: mongoJobId })
        },
      )
    })
  },

  /**
   *  GET Dataset Jobs
   */
  getDatasetJobs(req, res, next) {
    let snapshot = req.query.hasOwnProperty('snapshot') && req.query.snapshot
    let datasetId = snapshot
      ? bidsId.hexFromASCII(
          `${req.params.datasetId.slice(2)}-${req.query.snapshot}`,
        )
      : bidsId.encodeId(req.params.datasetId)
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
          c.crn.users.findOne({ id: job.userId }).then(user => {
            job.userMetadata = user
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
      })
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
          c.crn.users.findOne({ id: job.userId }).then(user => {
            job.userMetadata = user
            resolve()
          })
        })
      })
      Promise.all(userPromises).then(() => {
        // store request metadata
        let availableApps = {}

        // filter jobs by permissions
        let filteredJobs = []

        if (reqPublic) {
          async.each(
            jobs,
            (job, cb) => {
              buildMetadata(job)
              filteredJobs.push(job)
              cb()
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

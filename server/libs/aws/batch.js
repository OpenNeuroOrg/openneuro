/*eslint no-console: ["error", { allow: ["log"] }] */
import crypto from 'crypto'
import uuid from 'uuid'
import mongo from '../mongo'
import { ObjectID } from 'mongodb'
import { parallel, reduce } from 'async'
import config from '../../config'
import emitter from '../events'
import notifications from '../notifications'
import cron from 'cron'
import s3func from './s3'
import scitran from '../scitran'

//Handlers (need access to AwS Jobs handler to kickoff server side polling)
import awsJobs from '../../handlers/awsJobs'

let c = mongo.collections
let events = config.events

/**
 * Converts a list of job Ids into an array of objects as expected by the Batch API
 */
function _depsObjects(depsIds) {
  return depsIds.map(depId => {
    return { jobId: depId }
  })
}

const extractJobLog = job => {
  let jobLog = {
    datasetId: job.datasetId,
    datasetLabel: job.datasetLabel,
    snapshotId: job.snapshotId,
    appLabel: job.appLabel,
    appVersion: job.appVersion,
    status: job.analysis.status,
    created: job.analysis.created,
    parameters: job.parameters,
  }
  return jobLog
}

/*
 * Factory to create a stale job filter for a specific time
 * Takes a current Date object and the function returned is 
 * used with any filter
 */
const staleJobFilter = (now) => job => {
  // Kill jobs that are still running and where the actual container start time was 48 hours ago
  if (
    'startedAt' in job &&
    now.getTime() - job.startedAt >= 60 * 60 * 48 &&
    job.status === 'RUNNING'
  ) {
    return true
  }
  return false
}

export default aws => {
  const batch = new aws.Batch()
  const s3 = s3func(aws)

  const batchMethods = {
    sdk: batch,

    staleJobFilter: staleJobFilter,

    initCron() {
      new cron.CronJob(
        '*/10 * * * * *',
        this._pollJob,
        null,
        true,
        'America/Los_Angeles',
      )
      new cron.CronJob(
        '0 15 * * * *',
        this._cleanupJobs,
        null,
        true,
        'America/Los_Angeles',
      )
    },

    _pollJob() {
      /**
       * queries mongo to find running jobs and runs getJobStatus to check status and update if needed.
       * excluding 'UPLOADING' because jobs in that state have not been submitted to Batch
       * also just query jobs that have not had a notification sent otherwise REJECTED jobs will always be returned
       * polling occurs on a 10 second interval
       */
      c.crn.jobs.findAndModify(
        {
          'analysis.status': { $nin: ['SUCCEEDED', 'FAILED', 'UPLOADING'] },
          'analysis.notification': false,
        },
        [['analysis.statusAge', 'asc']],
        { $set: { 'analysis.statusAge': new Date() } },
        {},
        (err, res) => {
          // There might be no jobs to poll
          if (res.ok && res.value) {
            let job = res.value
            // handling rejected jobs here so we can send notifications for those jobs
            if (job.analysis.status === 'REJECTED') {
              batchMethods.jobComplete(job, job.userId)
            } else {
              awsJobs.getJobStatus(job, job.userId)
            }
          }
        },
      )
    },

    /*
     * Looks for rogue jobs and terminates them as needed
     */
    _cleanupJobs() {
      // Subtract two days from the current date to search
      const twoDaysAgo = new Date()
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
      // This query will get some jobs we don't want to stop since
      // those jobs may have spent time in pending or runnable
      // Tasks are filtered to only long run times in _terminateOldJobs
      const query = {
        'analysis.status': 'RUNNING',
        'analysis.started': { $lte: twoDaysAgo },
      }
      const projection = { 'analysis.batchStatus': true }
      c.crn.jobs.find(query, projection).toArray((err, jobs) => {
        // For each analysis, collect the running task ids
        const runningTasks = jobs.reduce((tasks, job) => {
          return tasks.concat(
            job.analysis.batchStatus
              .filter(status => status.status === 'RUNNING')
              .map(status => status.job),
          )
        }, [])
        batchMethods._terminateOldJobs(batch, runningTasks)
      })
    },

    /*
     * Takes a list of job ids to check for on Batch and kill if they have been
     * running for too long.
     * Up to 100 jobs can be killed at once
     */
    _terminateOldJobs(sdk, jobs) {
      if (jobs.length) {
        const params = { jobs: jobs.slice(0, 100) }
        sdk.describeJobs(params, (err, data) => {
          if (err) {
            console.log('_terminateOldJobs', err)
            return err
          }
          const now = new Date()
          const terminate = data.jobs.filter(staleJobFilter(now))
          terminate.map(job => {
            const params = {
              jobId: job.jobId,
              reason:
                'This analysis task did not complete within 48 hours and has failed due to timeout',
            }
            return sdk.terminateJob(params)
          })
        })
      }
    },

    /**
         * Register a job and store some additional metadata with AWS Batch
         */
    registerJobDefinition(jobDef, callback) {
      let error = this._validateInputs(jobDef)
      if (error) {
        return callback(error)
      }

      // This controls this value for the host container
      // child containers are always run without the privileged flag
      jobDef.containerProperties.privileged = true

      // Add the required docker socket and cache volumes
      jobDef.containerProperties.volumes = [
        { host: { sourcePath: '/var/run/docker.sock' }, name: 'docker-socket' },
      ]

      jobDef.containerProperties.mountPoints = [
        {
          sourceVolume: 'docker-socket',
          readOnly: false,
          containerPath: '/var/run/docker.sock',
        },
      ]

      //AWS Batch will choke if we leave descriptions property on payload so deleting before sending
      delete jobDef.descriptions
      delete jobDef.parametersMetadata
      delete jobDef.analysisLevels

      batch.registerJobDefinition(jobDef, callback)
    },

    deleteJobDefinition(appId, callback) {
      let appKeys = appId.split(':')
      let name = appKeys[0]
      let revision = parseInt(appKeys[1])
      c.crn.jobDefinitions.findOne(
        { jobDefinitionName: name, revision: revision },
        {},
        (err, jobDef) => {
          if (err) {
            callback(err)
          }
          let jobArn = jobDef.jobDefinitionArn
          batch.deregisterJobDefinition(
            { jobDefinition: jobArn },
            (err, batchData) => {
              if (err) {
                callback(err)
              } else {
                // Only remove it from the CRN database if disable succeeded
                c.crn.jobDefinitions.remove(
                  { jobDefinitionArn: jobArn },
                  err => {
                    callback(err, batchData)
                  },
                )
              }
            },
          )
        },
      )
    },

    /**
         * Prepare to run a job by downloading the scitran snapshot and
         * creating a mongo entry for it.
         */
    prepareAnalysis(job, callback) {
      job.uploadSnapshotComplete = !!job.uploadSnapshotComplete
      job.analysis = {
        analysisId: uuid.v4(),
        status: 'UPLOADING',
        created: new Date(),
        attempts: 0,
        notification: false,
      }
      //making consistent with agave ??
      job.appLabel = job.jobName
      job.appVersion = job.jobDefinition.match(/\d+$/)[0]

      scitran.downloadSymlinkDataset(
        job.snapshotId,
        (err, hash) => {
          job.datasetHash = hash
          job.parametersHash = crypto
            .createHash('md5')
            .update(JSON.stringify(job.parameters))
            .digest('hex')

          // jobDefintion is the full ARN including version, region, etc
          c.crn.jobs.findOne(
            {
              jobDefinition: job.jobDefinition,
              datasetHash: job.datasetHash,
              parametersHash: job.parametersHash,
              snapshotId: job.snapshotId,
              deleted: { $ne: true },
            },
            {},
            (err, existingJob) => {
              if (err) {
                return callback(err)
              }
              if (existingJob) {
                return callback({ existingJob: existingJob })
              }

              c.crn.jobs.insertOne(job, (err, mongoJob) => {
                callback(err, job, mongoJob.insertedId)
              })
            },
          )
        },
        { snapshot: true },
      )
    },

    /**
         * Upload any required data and submit jobs to Batch API
         *
         * This is called by worker processes and must be process safe.
         */
    startAnalysis(job, jobId, userId, callback) {
      let hash = job.datasetHash
      s3.uploadSnapshot(hash, () => {
        const batchJobParams = this.buildBatchParams(job, hash)

        this.startBatchJobs(batchJobParams, jobId, err => {
          if (err) {
            // This is an unexpected error, probably from batch.
            console.log(err)
            // Cleanup the failed to submit job
            // TODO - Maybe we save the error message into another field for display?
            c.crn.jobs.updateOne(
              { _id: ObjectID(jobId) },
              { $set: { 'analysis.status': 'REJECTED' } },
            )
          } else {
            let jobLog = extractJobLog(job)
            emitter.emit(
              events.JOB_STARTED,
              { job: jobLog, createdDate: job.analysis.created },
              userId,
            )
          }
          callback()
        })
      })
    },

    /**
         * Start AWS Batch Jobs for an analysis
         */
    startBatchJobs(batchJob, jobId, callback) {
      c.crn.jobDefinitions.findOne(
        { jobDefinitionArn: batchJob.jobDefinition },
        {},
        (err, jobDef) => {
          let analysisLevels = jobDef.analysisLevels
          let requiredParamsPresent = this._checkRequiredParams(
            batchJob,
            jobDef,
          )

          //if the required parameters are not present, the job will be rejected
          if (!requiredParamsPresent)
            return callback(new Error('Required Parameters Missing!'))

          const parallelSubmit = this.submitParallelJobs.bind(this)
          const singleSubmit = this.submitSingleJob.bind(this)
          this._submitLevels(
            batchJob,
            analysisLevels,
            parallelSubmit,
            singleSubmit,
            (err, submitLevelIds) => {
              if (err) {
                return callback(err)
              } else {
                // When all jobs are submitted, update job state with all batch ids
                this._updateJobOnSubmitSuccessful(jobId, submitLevelIds.all)
                return callback(null, submitLevelIds.all)
              }
            },
          )
        },
      )
    },

    /*
     * For each analysis level, submit tasks for each component job
     */
    _submitLevels(
      batchJob,
      analysisLevels,
      parallelSubmit,
      singleSubmit,
      done,
    ) {
      reduce(
        analysisLevels,
        { last: [], all: [] }, // Reduction includes previous step state
        (submittedJobs, level, callback) => {
          let submitter
          let levelName = level.value

          // Pass analysis level to the BIDS app container
          let env = batchJob.containerOverrides.environment
          env.push({ name: 'BIDS_ANALYSIS_LEVEL', value: levelName })

          if (levelName.search('participant') != -1) {
            // Run participant level jobs in parallel
            submitter = parallelSubmit
          } else {
            // Other levels are serial
            submitter = singleSubmit
          }

          // Submit this level with the previous level as arguments
          submitter(batchJob, submittedJobs.last, (err, batchJobIds) => {
            if (err) {
              return callback(err)
            } else {
              // Submit the next set of jobs including the previous as deps
              return callback(null, {
                last: batchJobIds,
                all: submittedJobs.all.concat(batchJobIds),
              })
            }
          })
        },
        done,
      )
    },

    /**
        * build out batch job parameters from a job object and an optional snapshotHash
        * new job submission will pass a snapshotHash whereas retry will use hash on job object
        * returns batch job parameters
        */
    buildBatchParams(job, snapshotHash) {
      let hash = snapshotHash || job.datasetHash
      let batchParams = {
        jobDefinition: job.jobDefinition,
        jobName: job.jobName,
        jobQueue: config.aws.batch.queue,
        userId: job.userId,
        parameters: job.parameters,
        containerOverrides: {
          environment: [
            {
              name: 'BIDS_SNAPSHOT_ID',
              value: hash,
            },
            {
              name: 'BIDS_ANALYSIS_ID',
              value: job.analysis.analysisId,
            },
            {
              name: 'BIDS_DATASET_BUCKET',
              value: config.aws.s3.datasetBucket,
            },
            {
              name: 'BIDS_OUTPUT_BUCKET',
              value: config.aws.s3.analysisBucket,
            },
            {
              name: 'BIDS_INPUT_BUCKET',
              value: config.aws.s3.inputsBucket,
            },
          ],
        },
      }
      let hashList = this._checkForFileInputParameters(job.parameters)

      if (hashList) {
        batchParams.containerOverrides.environment.push({
          name: 'INPUT_HASH_LIST',
          value: hashList,
        })
      }
      return batchParams
    },

    _checkForFileInputParameters(parameters) {
      let fileRegex = /^\/input\/data\/([0-9a-f]{32})\//
      let hashList = ''
      let hashArray = []
      Object.keys(parameters).forEach(param => {
        let result = fileRegex.exec(parameters[param])
        if (result) {
          hashArray.push(result[1])
        }
      })
      if (hashArray.length) {
        hashArray = hashArray.sort()
        hashList = hashArray.join(' ')
      }
      return hashList
    },

    _checkRequiredParams(job, jobDef) {
      let paramsPresent = []
      let parameters = job.parameters
      let parametersMetadata = jobDef.parametersMetadata
      Object.keys(parametersMetadata).forEach(param => {
        if (parametersMetadata[param].required) {
          let exists =
            param === 'participant_label'
              ? !!parameters[param].length
              : !!parameters[param]
          paramsPresent.push(exists)
        }
      })

      return paramsPresent.every(flag => {
        return flag
      })
    },

    /**
         * Update mongo job on successful job submission to AWS Batch.
         * returns no return. Batch job start is happening after response has been send to client
         */
    _updateJobOnSubmitSuccessful(jobId, batchIds) {
      // create initial batchStatus array
      let batchStatus = batchIds.map(id => {
        return {
          status: 'SUBMITTED',
          job: id,
        }
      })

      c.crn.jobs.updateOne(
        { _id: ObjectID(jobId) },
        {
          $set: {
            'analysis.status': 'PENDING', //setting status to pending as soon as job submissions is successful
            'analysis.attempts': 1,
            'analysis.jobs': batchIds, // Should be an array of AWS ids for each AWS batch job
            'analysis.batchStatus': batchStatus,
            uploadSnapshotComplete: true,
          },
        },
        () => {
          //error handling???
        },
      )
    },

    /**
         * Submit parallel jobs to AWS batch
         * for jobs with a subjectList parameter, we want to start all those jobs in parallel
         * submits all jobs in parallel and callsback with an array of the AWS batch ids for all the jobs
         */
    submitParallelJobs(batchJob, deps, callback) {
      let job = (params, callback) => {
        batch.submitJob(params, (err, data) => {
          if (err) {
            return callback(err)
          }
          //pass the AWS batch job ID
          let jobId = data.jobId
          callback(null, jobId)
        })
      }
      // want to add userId to parameters before submitting job to batch (below)
      let userId = batchJob.userId

      if (
        batchJob.parameters.hasOwnProperty('participant_label') &&
        batchJob.parameters.participant_label instanceof Array &&
        batchJob.parameters.participant_label.length > 0
      ) {
        let jobs = []
        let groups = this._partitionLabels(
          batchJob.parameters.participant_label,
        )
        groups.forEach(subjectGroup => {
          let subjectBatchJob = JSON.parse(JSON.stringify(batchJob))
          subjectBatchJob.dependsOn = _depsObjects(deps)
          // Reduce participant_label to a single group of subjects
          subjectBatchJob.parameters.participant_label = subjectGroup
          this._addJobArguments(subjectBatchJob)
          delete subjectBatchJob.parameters
          delete subjectBatchJob.userId //need to delete userId because batch API does not expect a userId prop and will error
          // want to add userId to parameters so we can see who is running a given job;
          subjectBatchJob.parameters = {
            userId: userId,
          }

          jobs.push(job.bind(this, subjectBatchJob))
        })
        parallel(jobs, callback)
      } else {
        // Parallel job with no participants passed in
        let err = new Error('Parallel job submitted with no subjects specified')
        err.http_code = 422
        callback(err)
      }
    },

    /**
         * Submits a single job to AWS Batch
         * for jobs without a subjectList parameter we are running all subjects in one job.
         * callsback with a single element array containing the AWS batch ID.
         */
    submitSingleJob(batchJob, deps, callback) {
      let singleBatchJob = JSON.parse(JSON.stringify(batchJob))

      // want to add userId to parameters before submitting job to batch (below)
      let userId = singleBatchJob.userId
      delete singleBatchJob.userId //need to delete userId because batch API does not expect a userId prop and will error

      this._addJobArguments(singleBatchJob)
      singleBatchJob.dependsOn = _depsObjects(deps)
      // After constructing the job document, remove invalid object from batch job
      delete singleBatchJob.parameters
      // want to add userId to parameters so we can see who is running a given job;
      singleBatchJob.parameters = {
        userId: userId,
      }
      batch.submitJob(singleBatchJob, (err, data) => {
        if (err) {
          return callback(err)
        }
        callback(null, [data.jobId]) //storing jobId's as array in mongo to support multi job analysis
      })
    },

    /**
         * returns jobs array for given analysis from Batch
         */
    getAnalysisJobs(job, callback) {
      let jobs = job.analysis.jobs
      let params = {
        jobs: jobs,
      }

      batch.describeJobs(params, (err, resp) => {
        if (err) {
          return callback(err)
        }
        callback(null, resp.jobs)
      })
    },

    /**
         * Convert JSON parameters into a string to pass to the bids-app container
         *
         * Accepts an array of parameter objects
         * {key: ...value}
         */
    _prepareArguments(parameters) {
      return Object.keys(parameters)
        .filter(key => {
          // Skip empty or false boolean arguments
          let value = parameters[key]
          if (value instanceof Array) {
            return value.length > 0
          } else {
            return parameters[key]
          }
        })
        .map(key => {
          let argument = '--' + key + ' '
          let value = parameters[key]
          if (typeof value === 'boolean') {
            // Don't include the value if it is a boolean
            // Arguments should be '--<key>' not '--<key> true'
            value = ''
            // Trim the extra space added after the flag
            argument = argument.slice(0, -1)
          } else if (typeof value === 'string') {
            value = this._formatString(parameters[key])
          }
          if (value instanceof Array) {
            value = value
              .map(item => {
                return typeof item === 'string'
                  ? this._formatString(item)
                  : item
              })
              .join(' ')
          }
          return argument.concat(value)
        })
        .join(' ')
    },

    /**
         * If a string argument has any whitespace we need to make sure that we single quote it.
         * Accepts a string and returns an appropriately formated string
         */
    _formatString(str) {
      let hasSpace = /\s/g.test(str)
      return hasSpace ? "'" + str + "'" : str
    },

    /**
      * For now, we limit parallelization to 20 subjobs
      *
      * Takes a list of labels and returns a list of no more than 20 lists.
      */
    _partitionLabels(labels) {
      // Limit to 20 groups
      let pCount = Math.min(20, labels.length)
      let partitions = new Array(pCount)
      labels.forEach((label, index) => {
        let bucket = partitions[index % pCount]
        if (bucket instanceof Array) {
          bucket.push(label)
        } else {
          partitions[index % pCount] = [label]
        }
      })
      return partitions
    },

    /**
         * Convert batchJob.parameters to a BIDS_ARGUMENTS environment var
         * and add to document to submit the job
         */
    _addJobArguments(batchJob) {
      let env = batchJob.containerOverrides.environment
      let bidsArguments = this._prepareArguments(batchJob.parameters)
      env.push({ name: 'BIDS_ARGUMENTS', value: bidsArguments })
    },

    _validateInputs(jobDef) {
      let vcpusMax = config.aws.batch.vcpusMax
      let memoryMax = config.aws.batch.memoryMax

      if (jobDef.containerProperties.vcpus > vcpusMax) {
        let err = new Error('Vcpus exceeds max allowed per app')
        err.http_code = 422
        return err
      }

      if (jobDef.containerProperties.memory > memoryMax) {
        let err = new Error('Memory exceeds max allowed per app')
        err.http_code = 422
        return err
      }

      // Only save jobs with valid analysisLevels
      if (
        !jobDef.hasOwnProperty('analysisLevels') ||
        jobDef.analysisLevels.length === 0
      ) {
        let err = new Error(
          'App definitions require at least one analysis level',
        )
        err.http_code = 422
        return err
      }

      return null
    },

    /*
         * Processes job complete tasks (notifications and event emit)
         */
    jobComplete(job, userId) {
      if (!job.analysis.notification) {
        // Save a summary of the job object instead of the whole dataset
        let jobLog = extractJobLog(job)
        emitter.emit(
          events.JOB_COMPLETED,
          { job: jobLog, completedDate: new Date() },
          userId,
        )
        notifications.jobComplete(job)
        let jobId = typeof job._id === 'object' ? job._id : ObjectID(job._id)
        c.crn.jobs.updateOne(
          { _id: jobId },
          {
            $set: {
              'analysis.notification': true,
            },
          },
        )
      }
    },
  }

  return batchMethods
}

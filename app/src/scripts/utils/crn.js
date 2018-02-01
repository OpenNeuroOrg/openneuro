import request from './request'
import config from '../../../config'

/**
 * CRN
 *
 * A library for interacting with the CRN server side
 * application.
 */
export default {
  // Users -----------------------------------------------------------------------------------

  /**
   * Verify User
   *
   * A proxy of scitran verify user endpoint.
   */
  verifyUser() {
    return request.get(config.crn.url + 'users/self', {})
  },

  /**
   * Create User
   *
   */
  createUser(user) {
    return request.post(config.crn.url + 'users', { body: user })
  },

  /**
   * Get Blacklist
   */
  getBlacklist() {
    return request.get(config.crn.url + 'users/blacklist', {})
  },

  /**
   * Blacklist User
   */
  blacklistUser(user) {
    return request.post(config.crn.url + 'users/blacklist', { body: user })
  },

  /**
   * Un Blacklist
   */
  unBlacklistUser(userId) {
    return request.del(config.crn.url + 'users/blacklist/' + userId, {})
  },

  /**
   * Finish OAuth2 ORCID flow
   */
  getORCIDToken(code) {
    return request.get(config.crn.url + 'users/signin/orcid', {
      query: { code, home: true },
    })
  },

  /**
   * Get ORCID profile
   */
  getORCIDProfile(accessToken) {
    return request.get(config.crn.url + 'users/orcid', {
      query: { accessToken },
    })
  },

  /**
   * Get ORCID profile
   */
  refreshORCIDToken(refreshToken) {
    return request.get(config.crn.url + 'users/orcid/refresh', {
      query: { refreshToken },
    })
  },

  // Datasets --------------------------------------------------------------------------------

  /**
   * Create Project
   *
   * Takes a request body and
   * generates a request to make a project in scitran.
   */
  createProject(group, label) {
    return request.post(config.crn.url + 'datasets', {
      body: { group, label },
    })
  },

  /**
   * Create Snapshot
   */
  createSnapshot(projectId) {
    return request.post(
      config.crn.url + 'datasets/' + projectId + '/snapshot',
      {},
    )
  },

  /**
   * Add Permission
   */
  addPermission(container, id, permission) {
    permission.site = 'local'
    return request.post(config.crn.url + 'datasets/' + id + '/permissions', {
      body: permission,
    })
  },

  // Jobs ------------------------------------------------------------------------------------

  /**
   * Get Apps
   *
   * Returns a list of available apps that
   * can be run on AWS Batch
   */
  getApps() {
    return request.get(config.crn.url + 'apps', { auth: false })
  },

  /**
   * Define Jobs
   */
  defineJob(jobDef) {
    return request.post(config.crn.url + 'jobs/definitions', { body: jobDef })
  },

  /**
   * Delete app definition
   */
  deleteJobDefinition(appId) {
    return request.del(config.crn.url + 'jobs/definitions/' + appId, {})
  },

  /**
   * Get Jobs
   */
  getJobs(isPublic, all, appName = null, status = null, latest = null) {
    let query = {
      public: isPublic,
      appName: appName,
      status: status,
      latest: latest,
      all: all,
      results: false,
    }
    return request.get(config.crn.url + 'jobs', { query: query })
  },

  getJobsQuery(query) {
    return request.get(config.crn.url + 'jobs', { query: query })
  },

  /**
   * Create Job
   *
   * Takes an options object with a name, appId
   * datasetId and userId and starts a Job.
   */
  createJob(job) {
    return request.post(
      config.crn.url + 'datasets/' + job.snapshotId + '/jobs',
      { body: job, query: { snapshot: true } },
    )
  },

  uploadParamFile(parameters, file, callback) {
    let options = {
      fields: {
        file: file.file,
        name: file.file.name,
        tags: [],
      },
    }
    return request
      .upload(config.crn.url + 'datasets/jobsupload', options)
      .then(res => {
        let filePath = res.body.filePath
        parameters[file.key] = filePath
        callback()
      })
      .catch(err => {
        callback(err)
      })
  },

  /**
   * Get Job
   *
   * Takes a job ID and callsback with
   * the job data.
   */
  getJob(datasetId, jobId, options) {
    return request.get(
      config.crn.url + 'datasets/' + datasetId + '/jobs/' + jobId,
      {
        query: { snapshot: options && options.snapshot },
      },
    )
  },

  cancelJob(datasetId, jobId) {
    return request.put(
      config.crn.url + 'datasets/' + datasetId + '/jobs/' + jobId,
      {},
    )
  },

  /**
   * Retry Job
   *
   * Take a jobId and retries the job with the same
   * dataset and settings.
   */
  retryJob(datasetId, jobId, options) {
    return request.post(
      config.crn.url + 'datasets/' + datasetId + '/jobs/' + jobId + '/retry',
      {
        query: { snapshot: options && options.snapshot },
      },
    )
  },

  /**
   * Delete Job
   *
   * Take a jobId and deletes the job.
   */
  deleteJob(datasetId, jobId, options) {
    return request.del(
      config.crn.url + 'datasets/' + datasetId + '/jobs/' + jobId,
      {
        query: { snapshot: options && options.snapshot },
      },
    )
  },

  /**
   * Get Dataset Jobs
   */
  getDatasetJobs(datasetId, options) {
    return request.get(config.crn.url + 'datasets/' + datasetId + '/jobs', {
      query: { snapshot: options && options.snapshot },
    })
  },

  /**
   * Delete Dataset Jobs
   */
  deleteDatasetJobs(datasetId) {
    return request.del(config.crn.url + 'datasets/' + datasetId + '/jobs', {})
  },

  // Validation ------------------------------------------------------------------------------

  /**
   * Validate
   */
  validate(datasetId) {
    return request.post(
      config.crn.url + 'datasets/' + datasetId + '/validate',
      {},
    )
  },

  // Logs ------------------------------------------------------------------------------

  getJobLogs(jobId) {
    return request.get(config.crn.url + 'jobs/' + jobId + '/logs', {})
  },

  getLogstream(streamName) {
    return request.get(config.crn.url + 'logs/' + streamName, {})
  },

  getEventLogs() {
    return request.get(config.crn.url + 'eventlogs', {})
  },

  // Comments --------------------------------------------------------------------------

  getComments(datasetId) {
    console.log('calling crn.getComments')
    return request.get(config.crn.url + 'comments/' + datasetId, {})
  },

  createComment(datasetId, comment) {
    console.log('datasetId:', datasetId, 'comment:', comment)
    return request.post(config.crn.url + 'comments/' + datasetId, {
      body: comment,
    })
  },

  deleteComment(comment) {
    console.log('comment:', comment)
    return request.del(config.crn.url + 'comments/' + comment.commentId, {
      body: comment,
    })
  },
}

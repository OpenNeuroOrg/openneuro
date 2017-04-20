import request from './request';
import config  from '../../../config';

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
    verifyUser (callback) {
        request.get(config.crn.url + 'users/self', {}, callback);
    },

    /**
     * Create User
     *
     */
    createUser(user, callback) {
        request.post(config.crn.url + 'users', {body: user}, callback);
    },

    /**
     * Get Blacklist
     */
    getBlacklist(callback) {
        request.get(config.crn.url + 'users/blacklist', {}, callback);
    },

    /**
     * Blacklist User
     */
    blacklistUser(user, callback) {
        request.post(config.crn.url + 'users/blacklist', {body: user}, callback);
    },

    /**
     * Un Blacklist
     */
    unBlacklistUser(userId, callback) {
        request.del(config.crn.url + 'users/blacklist/' + userId, {}, callback);
    },

// Datasets --------------------------------------------------------------------------------

    /**
     * Create Project
     *
     * Takes a request body and
     * generates a request to make a project in scitran.
     */
    createProject (group, label, callback) {
        request.post(config.crn.url + 'datasets', {
            body: {group, label}
        }, callback);
    },

    /**
     * Create Snapshot
     */
    createSnapshot (projectId, callback) {
        request.post(config.crn.url + 'datasets/' + projectId + '/snapshot', {}, callback);
    },

    /**
     * Add Permission
     */
    addPermission(container, id, permission, callback) {
        permission.site = 'local';
        request.post(config.crn.url + 'datasets/' + id + '/permissions', {body: permission}, callback);
    },

// Jobs ------------------------------------------------------------------------------------

    /**
     * Get Apps
     *
     * Returns a list of available apps that
     * can be run on AWS Batch
     */
    getApps(callback) {
        request.get(config.crn.url + 'apps', {auth: false}, callback);
    },


    /**
     * Define Jobs
     */
    defineJob(jobDef, callback) {
        request.post(config.crn.url + 'jobs/definitions', {body: jobDef}, callback);
    },

    /**
    * Disable Job
    */
    disableJobDefinition(name, jobArn, callback) {
        request.put(config.crn.url + 'jobs/definitions/' + name, {body: {arn: jobArn}}, callback);
    },

    /**
     * Get Jobs
     */
    getJobs(callback, isPublic) {
        request.get(config.crn.url + 'jobs', {query: {public: isPublic}}, callback);
    },

    /**
     * Create Job
     *
     * Takes an options object with a name, appId
     * datasetId and userId and starts a Job.
     */
    createJob(job, callback) {
        request.post(config.crn.url + 'datasets/' + job.snapshotId + '/jobs', {body: job, query: {snapshot: true}}, callback);
    },

    /**
     * Get Job
     *
     * Takes a job ID and callsback with
     * the job data.
     */
    getJob(datasetId, jobId, callback, options) {
        request.get(config.crn.url + 'datasets/' + datasetId + '/jobs/' + jobId, {
            query: {snapshot: options && options.snapshot}
        }, callback);
    },

    /**
     * Retry Job
     *
     * Take a jobId and retries the job with the same
     * dataset and settings.
     */
    retryJob(datasetId, jobId, callback, options) {
        request.post(config.crn.url + 'datasets/' + datasetId + '/jobs/' + jobId + '/retry', {
            query: {snapshot: options && options.snapshot}
        }, callback);
    },

    /**
     * Get Dataset Jobs
     */
    getDatasetJobs(datasetId, callback, options) {
        request.get(config.crn.url + 'datasets/' + datasetId + '/jobs', {
            query: {snapshot: options && options.snapshot}
        }, callback);
    },

    /**
     * Get Result Download Ticket
     */
    getResultDownloadTicket(datasetId, jobId, filePath, callback, options) {
        request.get(config.crn.url + 'datasets/' + datasetId + '/jobs/' + jobId + '/results/ticket', {
            query: {
                filePath,
                snapshot: options && options.snapshot
            }
        }, callback);
    },

    /**
     * Delete Dataset Jobs
     */
    deleteDatasetJobs(datasetId, callback) {
        request.del(config.crn.url + 'datasets/' + datasetId + '/jobs', {}, callback);
    },

// Validation ------------------------------------------------------------------------------

    /**
     * Validate
     */
    validate(datasetId, callback) {
        request.post(config.crn.url + 'datasets/' + datasetId + '/validate', {}, callback);
    }

};

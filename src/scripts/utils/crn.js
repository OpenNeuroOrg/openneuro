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

// Jobs ------------------------------------------------------------------------------------

    /**
     * Get Apps
     *
     * Returns a list of available apps that
     * can be run on AGAVE
     */
    getApps(callback) {
        request.get(config.crn.url + 'apps', {auth: false}, callback);
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
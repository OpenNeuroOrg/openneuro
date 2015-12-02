import request from './request';
import config  from '../config';

/**
 * CRN
 *
 * A library for interacting with the CRN server side
 * application.
 */
export default {

// Users -----------------------------------------------------------------------------------

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
		request.del(config.crn.url + 'users/blacklist/' + userId, callback);
	},

// Jobs ------------------------------------------------------------------------------------

	/**
	 * Get Apps
	 *
	 * Returns a list of available apps that
	 * can be run on AGAVE
	 */
	getApps(callback) {
		request.get(config.crn.url + 'apps', {}, callback);
	},

	/**
	 * Create Job
	 *
	 * Takes an options object with a name, appId
	 * datasetId and userId and starts a Job.
	 */
	createJob(options, callback) {
		request.post(config.crn.url + 'jobs', {body: options}, callback);
	},

	/**
	 * Get Dataset Jobs
	 */
	getDatasetJobs(datasetId, callback) {
		request.get(config.crn.url + 'jobs/' + datasetId, {}, callback);
	},

	/**
	 * Get Result Download Ticket
	 */
	getResultDownloadTicket(jobId, fileName, callback) {
		request.get('http://localhost:8765/api/v1/jobs/' + jobId + '/results/' + fileName + '/ticket', {}, callback);
	}

}
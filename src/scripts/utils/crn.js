import request from './request';
import config  from '../config';

/**
 * CRN
 *
 * A library for interacting with the CRN server side
 * application.
 */
export default {

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
	}

}
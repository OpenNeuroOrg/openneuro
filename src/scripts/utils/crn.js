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
	}

}
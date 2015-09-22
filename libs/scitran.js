import request from './request';
import config  from '../config';

/**
 * Scitran
 *
 * A library for interactions with the
 * scitran API.
 */
export default {

	/**
	 * Create User
	 */
	createUser(user, callback) {
		request.post(config.scitran.baseURL + 'users', {body: user}, callback);
	}

}
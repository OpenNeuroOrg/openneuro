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
		request.post(config.scitran.baseURL + 'users', {body: user}, (err, res) => {
			this.createGroup(user._id, user._id, callback);
		});
	},

	/**
     * Create Group
     *
     * Takes a groupName and a userId and
     * creates a group with that user as the
     * admin.
     */
    createGroup (groupName, userId, callback) {
        let body = {
            _id: groupName,
            roles: [{access: 'admin', _id: userId}]
        };
        request.post(config.scitran.url + 'groups', {body: body}, callback);
    }

}
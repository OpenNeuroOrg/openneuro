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
     * Is Super User
     */
    isSuperUser(accessToken, callback) {
        request.get(config.scitran.url + 'users/self', {
            headers: {
                Authorization: accessToken
            }
        }, (err, res) => {
            callback(!!res.body.wheel);
        });
    },

    /**
     * Get User
     */
    getUser(accessToken, callback) {
        request.get(config.scitran.url + 'users/self', {
            headers: {
                Authorization: accessToken
            }
        }, callback);
    },

	/**
	 * Create User
	 */
	createUser(user, callback) {
	    request.post(config.scitran.url + 'users', {body: user}, (err, res) => {
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
	    name: groupName,
        };
	console.log(body);
        request.post(config.scitran.url + 'groups', {body: body}, (err, res) => {
            this.addRole('groups', groupName, {_id: groupName, access: 'admin', site: 'local'}, callback);
        });
    },

    /**
     * Get Project
     *
     */
    getProject (projectId, callback) {
        request.get(config.scitran.url + 'projects/' + projectId, {}, callback);
    },

    /**
     * Add Role
     */
    addRole(container, id, role, callback) {
        request.post(config.scitran.url + container + '/' + id + '/roles', {body: role}, callback); 
    }

}

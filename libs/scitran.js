import request from './request';
import config  from '../config';
import fs      from 'fs';
import crypto  from 'crypto';
import files   from './files';

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
        request.post(config.scitran.url + 'groups', {body: body}, (err, res) => {
            this.addRole('groups', groupName, {_id: groupName, access: 'admin', site: 'local'}, callback);
        });
    },

    /**
     * Get Project
     *
     */
    getProject (projectId, callback, options) {
        let modifier = options && options.snapshot ? 'snapshots/' : '';
        request.get(config.scitran.url + modifier + 'projects/' + projectId, {}, callback);
    },

    /**
     * Add Role
     */
    addRole(container, id, role, callback) {
        request.post(config.scitran.url + container + '/' + id + '/roles', {body: role}, callback);
    },

    /**
     * Download Symlink Dataset
     *
     * Downloads a tar archive of symlinks to reconstruct a
     * BIDS dataset. Stores it under a hash id in a local
     * file store and updates all symlinks to point to the
     * correct files in scitran's file store.
     */
    downloadSymlinkDataset(datasetId, callback) {
        request.post(config.scitran.url + 'snapshots/download', {
            query: {format: 'bids', query: true},
            body: {
                nodes: [
                    {
                        _id: datasetId,
                        level: 'project'
                    }
                ],
                optional: false
            }
        }, (err, res) => {
            let ticket = res.body.ticket;
            request.get(config.scitran.url + 'download', {query: {symlinks: true, ticket: ticket}}, (err2, res2) => {
                if (!err2) {
                    let hash = crypto.createHash('md5').update(res2.body).digest('hex');
                    fs.readdir('./persistent/datasets/', (err3, contents) => {
                        if (contents && contents.indexOf(hash) > -1) {
                            callback(err, hash);
                        } else {
                            files.saveSymlinks(hash, res2.body, (err4) => {
                                callback(err, hash);
                            });
                        }
                    });
                }
            });
        });

    }

}

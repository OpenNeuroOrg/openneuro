import request from './request';
import config  from '../config';
import fs      from 'fs';
import tar     from 'tar-fs';
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
        request.post(config.scitran.url + 'download', {
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
                    fs.writeFile('./persistent/temp/' + hash + '.tar', res2.body, (err3) => {
                        if (err3) throw err3;
                        fs.createReadStream('./persistent/temp/' + hash + '.tar')
                            .pipe(tar.extract('./persistent/datasets/', {
                                map: function (header) {
                                    let originalDirName = header.name.split('/')[0];
                                    header.name = header.name.replace(originalDirName, hash);
                                    return header;
                                }
                            }))
                            .on('finish',   () => {
                                fs.unlink('./persistent/temp/' + hash + '.tar', () => {
                                    files.updateSymlinks('./persistent/datasets/' + hash, () => {
                                        callback(err, res);
                                    });
                                });
                            });
                    });
                }
            });
        });

    }

}


// function updateSymlinks(dir, callback) {
//     getFiles(dir, (files) => {
//         async.each(files, (path, cb) => {
//             fs.readlink(path, (err, linkPath) => {
//                 fs.unlink(path, () => {
//                     fs.symlink(config.scitran.fileStore + linkPath, path, cb);
//                 });
//             });
//         }, callback);
//     });
// }

// function getFiles (dir, callback, files_) {
//     files_ = files_ || [];
//     fs.readdir(dir, (err, files) => {
//         async.each(files, (filename, cb) => {
//             let path = dir + '/' + filename;
//             fs.lstat(path, (err, stats) => {
//                 if (stats.isSymbolicLink()) {
//                     files_.push(path);
//                     cb();
//                 } else {
//                     getFiles(path, (files) => {
//                         cb();
//                     }, files_);
//                 }
//             });
//         }, () => {
//             callback(files_);
//         });
//     });
// }

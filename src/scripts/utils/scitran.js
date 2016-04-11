import request  from './request';
import config   from '../../../config';

/**
 * Scitran
 *
 * A library for interactions with the
 * scitran service.
 */
export default  {

// User Management ------------------------------------------------------------------------

    /**
     * Get Users
     *
     * Gets a list of all users
     * Ignores request if public option is true.
     */
    getUsers (callback, isPublic) {
        if (isPublic) {callback(); return;}
        request.get(config.scitran.url + 'users', {}, callback);
    },

    /**
     * Verify User
     *
     * Checks if the currently logged in users
     * in in the scitran system and returns a
     * user object.
     */
    verifyUser (callback) {
        request.get(config.scitran.url + 'users/self', {}, callback);
    },

    /**
     * Add User
     *
     * Takes an email, first name, and last name
     * add adds the user.
     */
    addUser (userData, callback) {
        request.post(config.scitran.url + 'users', {body: userData}, () => {
            this.createGroup(userData._id, userData._id, callback);
        });
    },

    /**
     * Update User
     */
    updateUser (userId, userData, callback) {
        request.put(config.scitran.url + 'users/' + userId, {body: userData}, (err, res) => {
            callback(err, res);
        });
    },

    /**
     * Remove User
     *
     * Takes a userId and removes the user.
     */
    removeUser (userId, callback) {
        request.del(config.scitran.url + 'users/' + userId, (err, res) => {
            callback(err, res);
        });
    },

// Create ---------------------------------------------------------------------------------

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
    },

    /**
     * Create Project
     *
     * Takes a request body and
     * generates a request to make a project in scitran.
     */
    createProject (body, callback) {
        request.post(config.scitran.url + 'projects', {body: body}, callback);
    },

    /**
     * Create Subject
     *
     */
    createSubject (projectId, subjectName, callback) {
        request.post(config.scitran.url + 'sessions', {
            body: {
                project: projectId,
                label: subjectName,
                subject: {
                    code: 'subject'
                }
            }
        }, callback);
    },

    /**
     * Create Session
     *
     */
    createSession (projectId, subjectId, sessionName, callback) {
        request.post(config.scitran.url + 'sessions', {
            body: {
                project: projectId,
                label: sessionName,
                subject: {
                    code: subjectId
                }
            }
        }, callback);
    },

    /**
     * Create Modality
     *
     */
    createModality (sessionId, modalityName, callback) {
        request.post(config.scitran.url + 'acquisitions', {
            body: {
                session: sessionId,
                label: modalityName
            }
        }, callback);
    },

    /**
     * Add Tag
     */
    addTag (containerType, containerId, tag, callback) {
        request.post(config.scitran.url + containerType + '/' + containerId + '/tags', {
            body: {value: tag}
        }, callback);
    },

    /**
     * Add Permission
     */
    addPermission(container, id, permission, callback) {
        permission.site = 'local';
        request.post(config.scitran.url + container + '/' + id + '/permissions', {body: permission}, callback);
    },

// Read -----------------------------------------------------------------------------------

    /**
     * Get Projects
     *
     */
    getProjects (options, callback) {
        let auth = options.hasOwnProperty('authenticate') ? options.authenticate : true;
        let modifier = options && options.snapshot ? 'snapshots/' : '';
        request.get(config.scitran.url + modifier + 'projects', {auth}, (err, res) => {
            callback(res.body);
        });
    },

    /**
     * Get Project
     *
     */
    getProject (projectId, callback, options) {
        let modifier = options && options.snapshot ? 'snapshots/' : '';
        request.get(config.scitran.url + modifier + 'projects/' + projectId, {}, (err, res) => {
            callback(res);
        });
    },

    /**
     * Get Sessions
     *
     */
    getSessions (projectId, callback, options) {
        let modifier = options && options.snapshot ? 'snapshots/' : '';
        request.get(config.scitran.url + modifier + 'projects/' + projectId + '/sessions', {
            query: {public: true}
        }, (err, res) => {
            callback(res.body);
        });
    },

    /**
     * Get Session
     *
     */
    getSession (sessionId, callback, options) {
        let modifier = options && options.snapshot ? 'snapshots/' : '';
        request.get(config.scitran.url + modifier + 'sessions/' + sessionId, {}, (err, res) => {
            callback(res.body);
        });
    },

    /**
     * Get Acquisitions
     *
     */
    getAcquisitions (sessionId, callback, options) {
        let modifier = options && options.snapshot ? 'snapshots/' : '';
        request.get(config.scitran.url + modifier + 'sessions/' + sessionId + '/acquisitions', {
            query: {public: true}
        }, (err, res) => {
            callback(res.body);
        });
    },

    /**
     * Get Acquisition
     *
     */
    getAcquisition (acquisitionId, callback, options) {
        let modifier = options && options.snapshot ? 'snapshots/' : '';
        request.get(config.scitran.url  + modifier + 'acquisitions/' + acquisitionId, {}, (err, res) => {
            callback(res.body);
        });
    },

    /**
     * Get File
     *
     */
    getFile (level, id, filename, callback, options) {
        let modifier = options && options.snapshot ? 'snapshots/' : '';
        request.get(config.scitran.url + modifier + level + '/' + id + '/files/' + filename, {}, callback);
    },

    /**
     * Get Download Ticket
     *
     */
    getDownloadTicket (level, id, filename, callback, options) {
        let modifier = options && options.snapshot ? 'snapshots/' : '';
        request.get(config.scitran.url + modifier + level + '/' + id + '/files/' + filename, {
            query: {ticket: ''}
        }, callback);
    },

    /**
     * Get BIDS Download Ticket
     *
     */
    getBIDSDownloadTicket (projectId, callback, options) {
        let modifier = options && options.snapshot ? 'snapshots/' : '';
        request.post(config.scitran.url + modifier + 'download', {
            query: {format: 'bids'},
            body: {
                nodes:[
                    {_id: projectId, level: 'project'}
                ],
                optional: false
            }
        }, callback);
    },

// Delete ---------------------------------------------------------------------------------

    /**
     * Delete Container
     *
     */
    deleteContainer (type, id, callback) {
        request.del(config.scitran.url + type + '/' + id, callback);
    },

    /**
     * Delete File
     *
     */
    deleteFile (level, containerId, filename, callback) {
        request.del(config.scitran.url + level + '/' + containerId + '/files/' + filename, callback);
    },

    /**
     * Remove Tag
     */
    removeTag (containerType, containerId, tag, callback) {
        request.del(config.scitran.url + containerType + '/' + containerId + '/tags/' + tag, callback);
    },

    /**
     * Remove Permission
     */
    removePermission (container, id, userId, callback) {
        request.del(config.scitran.url + container + '/' + id + '/permissions/local/' + userId, callback);
    },

// Update ---------------------------------------------------------------------------------

    /**
     * Update Project
     *
     */
    updateProject (projectId, body, callback) {
        request.put(config.scitran.url + 'projects/' + projectId, {body}, (err, res) => {
            callback(err, res);
        });
    },

    /**
     * Update File
     *
     */
    updateFile (level, id, file, callback) {
        request.upload(config.scitran.url + level + '/' + id + '/files', {
            fields: {
                tags: '[]',
                file: file,
                name: file.name
            },
            query: {force: true}
        }, callback);
    },

    /**
     * Update File From String
     *
     */
    updateFileFromString (level, id, filename, value, type, tags, callback) {
        let file = new File([value], filename, {type: type});
        request.upload(config.scitran.url + level + '/' + id + '/files', {
            fields: {
                tags: tags ? JSON.stringify(tags) : '[]',
                file: file,
                name: filename
            },
            query: {force: true}
        }, callback);
    },

// Snapshots ------------------------------------------------------------------------------

    createSnapshot (projectId, callback) {
        request.post(config.scitran.url + 'snapshots', {
            query: {project: projectId}
        }, callback);
    },

    getProjectSnapshots (projectId, callback) {
        request.get(config.scitran.url + 'projects/' + projectId + '/snapshots', {
            query: {public: true}
        }, callback);
    },

    deleteSnapshot (projectId, callback) {
        request.del(config.scitran.url + 'snapshots/projects/' + projectId, callback);
    },

    updateSnapshotPublic(projectId, value, callback) {
        request.put(config.scitran.url + 'snapshots/projects/' + projectId + '/public', {
            body: {value}
        }, callback);
    },

// usage analytics ------------------------------------------------------------------------

    /**
     * Track Usage
     *
     * - type ('view' or 'download')
     */
    trackUsage (snapshotId, type, callback) {
        request.post(config.scitran.url + 'snapshots/projects/' + snapshotId + '/analytics', {
            query: {type}
        }, callback);
    },

    /**
     * Get Usage Analytics
     *
     * options
     * - type       ('view' or 'download')
     * - user_id    (string)
     * - start_date (date) year-month-day
     * - end_date   (date) year-month-day
     * - count      (boolean)
     * - limit      (integer)
     */
    getUsage (snapshotId, options, callback) {
        request.get(config.scitran.url + 'snapshots/projects/' + snapshotId + '/analytics', {
            query: options
        }, callback);
    }

};
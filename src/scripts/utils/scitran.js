import request from './request';
import async   from 'async';

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
     */
    getUsers (callback) {
        request.get('users', {}, callback);
    },
    
    /**
     * Verify User
     *
     * Checks if the currently logged in users
     * in in the scitran system and returns a
     * user object.
     */
    verifyUser (callback) {
        request.get('users/self', {}, callback);
    },

    /**
     * Add User
     *
     * Takes an email, first name, and last name
     * add adds the user.
     */
    addUser (userData, callback) {
        let self = this;
        request.post('users', {body: userData}, function (err, res) {
            self.createGroup(userData._id, userData._id, callback);
        });
    },

    /**
     * Remove User
     *
     * Takes a userId and removes the user.
     */
     removeUser (userId, callback) {
        request.del('users/' + userId, function (err, res) {
            request.del('groups/' + userId, function (err, res) {
                callback(err, res);
            });
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
        request.post('groups', {body: body}, callback);
    },

    /**
     * Create Project
     *
     * Takes a group name and a project name and
     * generates a request to make a project in scitran.
     */
    createProject (groupName, body, callback) {
        request.post('groups/' + groupName + '/projects', {body: body}, callback);
    },

    /**
     * Create Subject
     *
     */
    createSubject (projectId, subjectName, callback) {
        let body = {label: subjectName, subject_code: 'subject'};
        request.post('projects/' + projectId + '/sessions', {body: body}, callback);
    },

    /**
     * Create Session
     *
     */
    createSession (projectId, subjectId, sessionName, callback) {
        let body = {label: sessionName, subject_code: subjectId};
        request.post('projects/' + projectId + '/sessions', {body: body}, callback);
    },

    /**
     * Create Modality
     *
     */
    createModality (sessionId, modalityName, callback) {
        let body = {label: modalityName, datatype: 'modality'};
        request.post('sessions/' + sessionId + '/acquisitions', {body: body}, callback);
    },

// Read -----------------------------------------------------------------------------------

    /**
     * Get Projects
     *
     */
    getProjects (callback) {
        request.get('projects', {}, function (err, res) {
            callback(res.body);
        });
    },

    /**
     * Get Sessions
     *
     */
    getSessions (projectId, callback) {
        request.get('projects/' + projectId + '/sessions', {}, function (err, res) {
            callback(res.body);
        });
    },

    /**
     * Get Acquisitions
     *
     */
    getAcquisitions (sessionId, callback) {
        request.get('sessions/' + sessionId + '/acquisitions', {}, function (err, res) {
            callback(res.body);
        });
    },

    getBIDSSubjects (projectId, callback) {
        this.getSessions(projectId, function (sessions) {
            let subjects = [];
            async.each(sessions, function (session, cb) {
                if (session.subject_code === 'subject') {
                    request.get('sessions/' + session._id, {}, function (err, res) {
                        session.children = res.body.files;
                        session.name = session.label;
                        subjects.push(session);
                        cb();
                    })
                } else {
                    cb();
                }
            }, function () {
                callback(subjects);
            });
        });
    },

    getBIDSSessions (projectId, subjectId, callback) {
        this.getSessions(projectId, function (sciSessions) {
            let sessions = [];
            async.each(sciSessions, function (session, cb) {
                if (session.subject_code === subjectId) {
                    request.get('sessions/' + session._id, {}, function (err, res) {
                        session.children = res.body.files;
                        session.name = session.label;
                        sessions.push(session);
                        cb();
                    })
                } else {
                    cb();
                }
            }, function () {
                callback(sessions);
            });
        });
    },

    getBIDSModalities (sessionId, callback) {
        request.get('sessions/' + sessionId + '/acquisitions', {}, function (err, res) {
            callback(res.body);
        });
    },

    getBIDSDataset (projectId, callback) {
        let self = this;
        let dataset = {};
        request.get('projects/' + projectId, {}, function (err, res) {
            if (res.status !== 200) {return callback(res);}
            let project = res.body;
            dataset = self.formatDataset(project);
            self.getBIDSSubjects(res.body._id, function (subjects) {
                dataset.children = dataset.children.concat(subjects);
                async.each(subjects, function (subject, cb) {
                    self.getBIDSSessions(projectId, subject._id, function (sessions) {
                        subject.children = subject.children.concat(sessions);
                        async.each(sessions, function (session, cb1) {
                            self.getBIDSModalities(session._id, function (modalities) {
                                session.children = session.children.concat(modalities);
                                async.each(modalities, function (modality, cb2) {
                                    request.get('acquisitions/' + modality._id, {}, function (err, res) {
                                        for (let file of res.body.files) {file.name = file.filename;}
                                        modality.children = res.body.files;
                                        modality.name = modality.label;
                                        cb2();
                                    });
                                }, cb1);
                            });
                        }, cb);
                    });
                }, function () {callback([dataset])});
            });
        });
    },

    formatDataset (project) {
        for (let file of project.files) {file.name = file.filename;}
        let dataset = {
            _id: project._id,
            name: project.name,
            type: 'folder',
            permissions: project.permissions,
            public: project.public,
            children: project.files,
            description: this.formatDescription(project.notes),
            status: this.formatStatus(project.notes),
        };

        return dataset;
    },

    formatDescription (notes) {
        let description = {
            "Name": "",
            "License": "",
            "Authors": [],
            "Acknowledgements": "",
            "HowToAcknowledge": "",
            "Funding": "",
            "ReferencesAndLinks": ""
        };

        if (notes) {
            for (let note of notes) {
                if (note.author === 'description') {
                    description = JSON.parse(note.text);
                }
            }
        }

        return description;
    },

    formatStatus (notes) {
        let status = {};
        if (notes) {
            for (let note of notes) {
                if (note.author === 'uploadStatus' && note.text === 'incomplete') {
                    status['uploadIncomplete'] = true;
                }
            }
        }
        return status;
    },

// Delete ---------------------------------------------------------------------------------

    /**
     * Delete Container
     *
     */
    deleteContainer (type, id, callback) {
        request.del(type + '/' + id, function (err, res) {
            callback();
        });
    },

    deleteDataset (projectId, callback) {
        let self = this;
        this.getSessions(projectId, function (sessions) {
            async.each(sessions, function (session, cb) {
                self.getAcquisitions(session._id, function (acquisitions) {
                    async.each(acquisitions, function (acquisition, cb1) {
                        self.deleteContainer('acquisitions', acquisition._id, cb1);
                    }, function () {
                        self.deleteContainer('sessions', session._id, cb);
                    });
                });
            }, function () {
                self.deleteContainer('projects', projectId, callback);
            });
        });
    },

// Update ---------------------------------------------------------------------------------

    updateProject (projectId, body, callback) {
        request.put('projects/' + projectId, {body}, function (err, res) {
            callback(err, res);
        });
    }

};
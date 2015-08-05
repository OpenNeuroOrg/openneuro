import request   from './request';
import uploads   from './upload';
import userStore from '../user/user.store';
import async     from 'async';

/**
 * Scitran
 *
 * A library for interactions with the
 * scitran service.
 */
export default  {

    /**
     * Verify User
     *
     * Checks if the currently logged in users
     * in in the scitran system and returns a
     * user object.
     */
    verifyUser (callback) {
        request.get('users/self', callback);
    },

// Create ---------------------------------------------------------------------------------

    /**
     * Create Project
     *
     * Takes a group name and a project name and
     * generates a request to make a project in scitran.
     */
    createProject (groupName, projectName, callback) {
        let body = {name: projectName};
        request.post('groups/' + groupName + '/projects', {body: body}, function (err, res) {
            callback(err, res, projectName)
        });
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

    /**
     * Upload File
     *
     * Pushed upload details into an upload queue.
     */
    uploadFile (level, id, file, tag) {
        let url = level + '/' + id + '/file/' + file.name;
        uploads.add({url: url, file: file, tag: tag, progressStart: this.progressStart, progressEnd: this.progressEnd});
    },

    currentFiles: [],

    /**
     * Upload
     *
     * Takes an entire bids file tree and and file count
     * and recurses through and uploads all the files.
     * Additionally takes a progress callback that gets
     * updated at the start and end of every file or
     * folder upload request.
     */
    upload (fileTree, count, progress) {
        let self = this;
        self.completed = 0;
        self.count = count;
        self.progressStart = function (filename) {
            self.currentFiles.push(filename);
            progress({total: self.count, completed: self.completed, currentFiles: self.currentFiles});
        }
        self.progressEnd = function (filename) {
            let index = self.currentFiles.indexOf(filename);
            self.currentFiles.splice(index, 1);
            self.completed++;
            progress({total: self.count, completed: self.completed, currentFiles: self.currentFiles});
        }
        let groupName = 'SquishyRoles';
        self.createProject(groupName, fileTree[0].name, function (err, res) {
            let projectId = res.body._id;
            self.progressEnd();
            self.uploadSubjects(fileTree[0].children, projectId);
        });
    },

    uploadSubjects (subjects, projectId) {
        let self = this;
        for (let subject of subjects) {
            if (subject.children && subject.children.length > 0) {
                self.progressStart(subject.name);
                self.createSubject(projectId, subject.name, function (err, res, name) {
                    self.progressEnd(res.req._data.name);
                    let subjectId = res.body._id;
                    self.uploadSessions(subject.children, projectId, subjectId);
                });
            } else {
                self.uploadFile('projects', projectId, subject, 'project');
            }
        }
    },

    uploadSessions (sessions, projectId, subjectId) {
        let self = this;
        for (let session of sessions) {
            if (session.children && session.children.length > 0) {
                self.progressStart(session.name);
                self.createSession(projectId, subjectId, session.name, function (err, res, name) {
                    self.progressEnd(res.req._data.name);
                    self.uploadModalities(session.children, res.body._id);
                }); 
            } else {
                self.uploadFile('sessions', subjectId, session, 'subject');
            }
        }
    },

    uploadModalities (modalities, subjectId) {
        let self = this;
        for (let modality of modalities) {
            if (modality.children && modality.children.length > 0) {
                self.progressStart(modality.name);
                self.createModality(subjectId, modality.name, function (err, res, name) {
                    self.progressEnd(res.req._data.name);
                    let modalityId = res.body._id;
                    self.uploadAquisitions(modality.children, modalityId);
                });
            } else {
                self.uploadFile('sessions', subjectId, modality, 'session');
            }
        }
    },

    uploadAquisitions (acquisitions, modalityId) {
        for (let acquisition of acquisitions) {
            this.uploadFile('acquisitions', modalityId, acquisition, 'modality');
        }
    },

// Read -----------------------------------------------------------------------------------

    getProjects (callback) {
        request.get('projects', function (err, res) {
            callback(res.body);
        });
    },

    getSessions (projectId, callback) {
        request.get('projects/' + projectId + '/sessions', function (err, res) {
            callback(res.body);
        });
    },

    getAcquisitions (sessionId, callback) {
        request.get('sessions/' + sessionId + '/acquisitions', function (err, res) {
            callback(res.body);
        });
    },

    getBIDSSubjects (projectId, callback) {
        this.getSessions(projectId, function (sessions) {
            let subjects = [];
            async.each(sessions, function (session, cb) {
                if (session.subject_code === 'subject') {
                    request.get('sessions/' + session._id, function (err, res) {
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
                    request.get('sessions/' + session._id, function (err, res) {
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
        request.get('sessions/' + sessionId + '/acquisitions', function (err, res) {
            callback(res.body);
        });
    },

    getBIDSDataset (projectId, callback) {
        let self = this;
        let dataset = {};
        request.get('projects/' + projectId, function (err, res) {
            for (let file of res.body.files) {file.name = file.filename;}
            dataset.name = res.body.name;
            dataset.type = 'folder';
            dataset.children = res.body.files;
            self.getBIDSSubjects(res.body._id, function (subjects) {
                dataset.children = dataset.children.concat(subjects);
                async.each(subjects, function (subject, cb) {
                    self.getBIDSSessions(projectId, subject._id, function (sessions) {
                        subject.children = subject.children.concat(sessions);
                        async.each(sessions, function (session, cb1) {
                            self.getBIDSModalities(session._id, function (modalities) {
                                session.children = session.children.concat(modalities);
                                async.each(modalities, function (modality, cb2) {
                                    request.get('acquisitions/' + modality._id, function (err, res) {
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

// Delete ---------------------------------------------------------------------------------

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
    }

};
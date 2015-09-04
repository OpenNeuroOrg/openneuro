import async     from 'async';
import scitran   from './scitran';
import userStore from '../user/user.store';

/**
 * Scitran
 *
 * A library for interactions with the
 * scitran service.
 */
export default  {

// Read -----------------------------------------------------------------------------------

    /**
     * Get Subjects
     *
     * Takes a projectId and returns all BIDS
     * subjects after they are separated out
     * of scitran sessions.
     */
    getSubjects (projectId, callback) {
        scitran.getSessions(projectId, (sessions) => {
            let subjects = [];
            async.each(sessions, (session, cb) => {
                if (session.subject_code === 'subject') {
                    scitran.getSession(session._id, (res) => {
                        session.children = res.files;
                        session.name = session.label;
                        subjects.push(session);
                        cb();
                    });
                } else {
                    cb();
                }
            }, () => {
                callback(subjects);
            });
        });
    },

    /**
     * Get Sessions
     *
     * Takes a projectId and a subjectId and
     * returns all BIDS sessions after they
     * are separated out of scitran sessions.
     */
    getSessions (projectId, subjectId, callback) {
        scitran.getSessions(projectId, (sciSessions) => {
            let sessions = [];
            async.each(sciSessions, (session, cb) => {
                if (session.subject_code === subjectId) {
                    scitran.getSession(session._id, (res) => {
                        session.children = res.files;
                        session.name = session.label;
                        sessions.push(session);
                        cb();
                    });
                } else {
                    cb();
                }
            }, () => {
                callback(sessions);
            });
        });
    },

    /**
     * Get Modalities
     *
     * Get all BIDS modalidalities for a session.
     */
    getModalities: scitran.getAcquisitions,

    /**
     * Get Datasets
     *
     * Returns a list of datasets including any
     * derived statuses and notes on each. Only returns
     * the top level 'project' container.
     */
    getDatasets (callback) {
        scitran.getProjects((projects) => {
            let results = [];
            projects.reverse();
            for (let project of projects) {
                if (project.group === userStore.data.scitran._id) {
                    let dataset = this.formatDataset(project);
                    results.push(dataset);
                }
            }
            callback(results);
        });
    },


    /**
     * Get Dataset
     *
     * Takes a projectId and returns a full
     * nested BIDS dataset.
     */
    getDataset (projectId, callback) {
        let dataset = {};
        scitran.getProject(projectId, (res) => {
            if (res.status !== 200) {return callback(res);}
            let project = res.body;
            dataset = this.formatDataset(project);
            this.getSubjects(res.body._id, (subjects) => {
                dataset.children = dataset.children.concat(subjects);
                async.each(subjects, (subject, cb) => {
                    this.getSessions(projectId, subject._id, (sessions) => {
                        subject.children = subject.children.concat(sessions);
                        async.each(sessions, (session, cb1) => {
                            this.getModalities(session._id, (modalities) => {
                                session.children = session.children.concat(modalities);
                                async.each(modalities, (modality, cb2) => {
                                    scitran.getAcquisition(modality._id, (res) => {
                                        for (let file of res.files) {file.name = file.filename;}
                                        modality.children = res.files;
                                        modality.name = modality.label;
                                        cb2();
                                    });
                                }, cb1);
                            });
                        }, cb);
                    });
                }, () => {callback(dataset)});
            });
        });
    },

// Update ---------------------------------------------------------------------------------

    /**
     * Add Permission
     *
     * Takes a projectId and a permission object and
     * adds the permission object if the user doesn't
     * already exist in the project.
     */
    addPermission(projectId, permission, callback) {
        scitran.getProject(projectId, (res) => {
            let exists = false;
            let permissions = res.body.permissions;
            for (let user of permissions) {
                if (user._id === permission._id) {
                    exists = true;
                }
            }
            if (!exists) {
                permissions.push(permission);
                scitran.updateProject(projectId, {permissions}, callback);
            } else {
                callback();
            }
        });
    },

    /**
     * Remove Permission
     *
     * Takes a projectId and a userId and removes
     * the user if they were a member of the project.
     */
    removePermission(projectId, userId, callback) {
        scitran.getProject(projectId, (res) => {
            let permissions = res.body.permissions;
            let index;
            for (let i = 0; i < permissions.length; i++) {
                let user = permissions[i];
                if (user._id === userId) {
                    index = i;
                }
            }
            if (index) {
                permissions.splice(index, 1);
                scitran.updateProject(projectId, {permissions}, callback);
            }
        });
    },

// Delete ---------------------------------------------------------------------------------

    /**
     * Delete Dataset
     *
     * Takes a projectId and delete the project
     * after recursing and removing all sub
     * containers.
     */
    deleteDataset (projectId, callback) {
        let self = this;
        scitran.getSessions(projectId, (sessions) => {
            async.each(sessions, (session, cb) => {
                scitran.getAcquisitions(session._id, (acquisitions) => {
                    async.each(acquisitions, (acquisition, cb1) => {
                        scitran.deleteContainer('acquisitions', acquisition._id, cb1);
                    }, () => {
                        scitran.deleteContainer('sessions', session._id, cb);
                    });
                });
            }, () => {
                scitran.deleteContainer('projects', projectId, callback);
            });
        });
    },

// Dataset Format Helpers -----------------------------------------------------------------

    /**
     * Format Dataset
     *
     * Takes a scitran project and returns
     * a formatted top level container of a
     * BIDS dataset.
     */
    formatDataset (project) {
        for (let file of project.files) {file.name = file.filename;}
        let dataset = {
            _id: project._id,
            name: project.name,
            type: 'folder',
            permissions: project.permissions,
            public: project.public,
            notes: project.notes,
            children: project.files,
            description: this.formatDescription(project.notes),
            status: this.formatStatus(project.notes),
            userOwns: this.userOwns(project)
        };

        return dataset;
    },
    
    /**
     * formatDescription
     *
     * Takes a notes array and returns
     * a BIDS description object if the is
     * a description note.
     */
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

    /**
     * Format Status
     *
     * Takes a notes array and returns
     * a dataset status object corresponding
     * to any statuses set in the notes.
     */
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

    /**
     * userOwns
     *
     * Takes a project and returns a boolean
     * representing whether the current user
     * is the owner of that dataset.
     */
    userOwns(project) {
        let userOwns = false
        if (project && project.permissions)
        for (let user of project.permissions) {
            if (userStore.data.scitran._id === user._id) {
                userOwns = true;
            }
        }
        return userOwns;
    },

};
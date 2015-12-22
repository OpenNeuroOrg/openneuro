import async     from 'async';
import scitran   from './scitran';
import crn       from './crn';
import userStore from '../user/user.store';

/**
 * BIDS
 *
 * A library for interactions with the
 * scitran service through BIDS concepts.
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
                if (session.tags.indexOf('subject') > -1) {
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
                let sesSubjectId;
                for (let tag of session.tags) {
                    if (tag.indexOf('subjectId-') > -1) {
                        sesSubjectId = tag.replace('subjectId-', '');
                    }
                }
                if (sesSubjectId === subjectId) {
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
     * the top level 'project' container. Takes an optional
     * boolean as second argument to specifiy if request
     * is made with authentication. Defaults to true.
     */
    getDatasets (callback, authenticate) {
        if (authenticate === undefined) {authenticate = true;}
        scitran.getProjects(authenticate, (projects) => {
            let results = [];

            // hide other user's projects from admins
            for (let project of projects) {
                if (!authenticate || this.userOwns(project)) {
                    let dataset = this.formatDataset(project, null);
                    results.push(dataset);
                }
            }

            callback(results);
        });
    },

    /**
     * Get Metadata
     *
     */
    getMetadata(project, callback) {

        // determine which metadata files are available
        let metadataFiles = [],
            metadata = {};
        if (project.files) {
            for (let file of project.files) {
                if (file.name === 'README') {
                    metadataFiles.push('README');
                }
                if (file.name === 'dataset_description.json') {
                    metadataFiles.push('dataset_description.json');
                }
            }
        }

        // load content of available metadata
        async.each(metadataFiles, (filename, cb) => {
            scitran.getFile('projects', project._id, filename, (err, file) => {
                let contents;
                try {
                    contents = JSON.parse(file.text);
                }
                catch (err) {
                    contents = file.text;
                }
                finally {
                    metadata[filename] = contents;
                }
                cb();
            });
        }, () => {
            callback(metadata);
        });
    },


    /**
     * Get Dataset
     *
     * Takes a projectId and returns a full
     * nested BIDS dataset.
     */
    getDataset (projectId, callback) {
        scitran.getProject(projectId, (res) => {
            if (res.status !== 200) {return callback(res);}
            let project = res.body;
            this.getMetadata(project, (metadata) => {
                let dataset = this.formatDataset(project, metadata['dataset_description.json']);
                dataset.README = metadata.README;
                this.getSubjects(projectId, (subjects) => {
                    dataset.containerType = 'projects';
                    dataset.children = this.labelFile(dataset.children, projectId, 'projects');
                    dataset.children = dataset.children.concat(subjects);
                    async.each(subjects, (subject, cb) => {
                        this.getSessions(projectId, subject._id, (sessions) => {
                            subject.containerType = 'sessions';
                            subject.children = this.labelFile(subject.children, subject._id, 'sessions');
                            subject.children = subject.children.concat(sessions);
                            async.each(sessions, (session, cb1) => {
                                this.getModalities(session._id, (modalities) => {
                                    session.containerType = 'sessions';
                                    session.children = this.labelFile(session.children, session._id, 'sessions');
                                    session.children = session.children.concat(modalities);
                                    async.each(modalities, (modality, cb2) => {
                                        scitran.getAcquisition(modality._id, (res) => {
                                            modality.containerType = 'acquisitions';
                                            modality.children = res.files;
                                            modality.children = this.labelFile(modality.children, modality._id, 'acquisitions');
                                            modality.name = modality.label;
                                            cb2();
                                        });
                                    }, cb1);
                                });
                            }, cb);
                        });
                    }, () => {
                        crn.getDatasetJobs(projectId, (err, res) => {
                            dataset.jobs = res.body;
                            callback(dataset);
                        });
                    });
                });
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
                crn.deleteDatasetJobs(projectId, (err, res) => {
                    scitran.deleteContainer('projects', projectId, callback);
                });
            });
        });
    },

// Dataset Format Helpers -----------------------------------------------------------------

    /**
     * Label File
     */
    labelFile (items, parentId, parentContainer) {
        items = items ? items : [];
        for (let item of items) {
            item.parentId = parentId;
            item.parentContainer = parentContainer;
        }
        return items;
    },

    /**
     * Format Dataset
     *
     * Takes a scitran project and returns
     * a formatted top level container of a
     * BIDS dataset.
     */
    formatDataset (project, description, users) {

        let files = [], attachments = [];
        if (project.files) {
            for (let file of project.files) {
                if (file.tags && file.tags.indexOf('attachment') > -1) {
                    attachments.push(file);
                } else {
                    files.push(file);
                }
            }
        }

        let dataset = {
            _id:         project._id,
            name:        project.label,
            group:       project.group,
            timestamp:   project.timestamp,
            type:        'folder',
            permissions: project.permissions,
            public:      project.public,
            notes:       project.notes,
            children:    files,
            description: this.formatDescription(project.metadata, description),
            attachments: attachments,
            status:      this.formatStatus(project.tags),
            userOwns:    this.userOwns(project),
            userCreated: this.userCreated(project),
            access:      this.userAccess(project)
        };
        dataset.authors = dataset.description.Authors;
        dataset.sharedWithMe = dataset.userOwns && !dataset.userCreated;

        return dataset;
    },

    /**
     * formatDescription
     *
     */
    formatDescription (metadata, description) {
        let description = description ? description : {
            "Name": "",
            "License": "",
            "Authors": [],
            "Acknowledgements": "",
            "HowToAcknowledge": "",
            "Funding": "",
            "ReferencesAndLinks": "",
            "DatasetDOI": ""
        };

        if (metadata && metadata.authors) {
            description.Authors = metadata.authors;
        }

        return description;
    },

    /**
     * Format Status
     *
     * Takes a metadata object and returns
     * a dataset status object corresponding
     * to any statuses set in the notes.
     */
    formatStatus (tags) {
        let status = {};
        if (tags) {
            for (let tag of tags) {
                if (tag === 'incomplete') {
                    status['uploadIncomplete'] = true;
                }
            }
        }
        return status;
    },

    /**
     * User Owns
     *
     * Takes a project and returns a boolean
     * representing whether the current user
     * is the owner of that dataset.
     */
    userOwns(project) {
        let userOwns = false
        if (project && project.permissions) {
            for (let user of project.permissions) {
                if (userStore.data.scitran._id === user._id) {
                    userOwns = true;
                }
            }
        }
        return userOwns;
    },

    /**
     * User Access
     *
     * Takes a project and returns the level of access
     * the current user has with that project.
     */
    userAccess(project) {
        let access = null;
        if (project && project.permissions) {
            for (let user of project.permissions) {
                if (userStore.data.scitran._id === user._id) {
                    access = user.access;
                }
            }
        }
        return access;
    },

    /**
     * User Created
     *
     * Takes project and returns boolean representing
     * whether the current user created the project.
     */
     userCreated(project) {
        if (!userStore.data.scitran) {return false;}
        return project.group === userStore.data.scitran._id;
     }

};
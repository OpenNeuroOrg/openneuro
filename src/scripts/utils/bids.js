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
    getSubjects (projectId, callback, options) {
        scitran.getSessions(projectId, (sessions) => {
            let subjects = [];
            async.each(sessions, (session, cb) => {
                if (session.subject.code === 'subject') {
                    scitran.getSession(session._id, (res) => {
                        session.children = res.files;
                        session.name = session.label;
                        subjects.push(session);
                        cb();
                    }, options);
                } else {
                    cb();
                }
            }, () => {
                callback(subjects);
            });
        }, options);
    },

    /**
     * Get Sessions
     *
     * Takes a projectId and a subjectId and
     * returns all BIDS sessions after they
     * are separated out of scitran sessions.
     */
    getSessions (projectId, subjectId, callback, options) {
        scitran.getSessions(projectId, (sciSessions) => {
            let sessions = [];
            async.each(sciSessions, (session, cb) => {
                if (session.subject.code === subjectId) {
                    scitran.getSession(session._id, (res) => {
                        session.children = res.files;
                        session.name = session.label;
                        sessions.push(session);
                        cb();
                    }, options);
                } else {
                    cb();
                }
            }, () => {
                callback(sessions);
            });
        }, options);
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
    getDatasets (callback, isPublic) {
        scitran.getProjects({authenticate: !isPublic, snapshot: isPublic}, (projects) => {
            let results = [];
            let publicResults = {}
            // hide other user's projects from admins & filter snapshots to display newest of each dataset
            if (projects) {
                for (let project of projects) {
                    if (isPublic) {
                        let dataset = this.formatDataset(project, null);
                        if (!publicResults.hasOwnProperty(project.original) || publicResults[project.original].snapshot_version < project.snapshot_version) {
                            publicResults[project.original] = dataset;
                        }
                    } else if (this.userAccess(project)) {
                        let dataset = this.formatDataset(project, null);
                        results.push(dataset);
                    }
                }
            }

            if (isPublic) {
                let results = [];
                for (let key in publicResults) {
                    results.push(publicResults[key]);
                }
                callback(results);
            } else {
                callback(results);
            }
        });
    },

    /**
     * Get Metadata
     *
     */
    getMetadata(project, callback, options) {

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
            }, options);
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
    getDataset (projectId, callback, options) {
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
                                        }, options);
                                    }, cb1);
                                }, options);
                            }, cb);
                        }, options);
                    }, () => {
                        crn.getDatasetJobs(projectId, (err, res) => {
                            dataset.jobs = res.body;
                            scitran.getBIDSDownloadTicket(projectId, (err, res) => {
                                let ticket = res.body.ticket;
                                let url    = res.req.url.split('?')[0] + '?ticket=' + ticket;
                                dataset.downloadUrl = url;
                                callback(dataset);
                            }, options);
                        }, options);
                    });
                }, options);
            }, options);
        }, options);
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
        scitran.addPermission('projects', projectId, permission, callback);
    },

    /**
     * Remove Permission
     *
     * Takes a projectId and a userId and removes
     * the user if they were a member of the project.
     */
    removePermission(projectId, userId, callback) {
        scitran.removePermission('projects', projectId, userId, callback);
    },

// Delete ---------------------------------------------------------------------------------

    /**
     * Delete Dataset
     *
     * Takes a projectId and delete the project
     * after recursing and removing all sub
     * containers.
     */
    deleteDataset (projectId, callback, options) {
        if (!options.snapshot) {
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
        } else {
            scitran.deleteSnapshot(projectId, callback);
        }
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
            /** same as original **/
            _id:         project._id,
            label:       project.label,
            group:       project.group,
            created:     project.created,
            modified:    project.modified,
            permissions: project.permissions,
            public:      project.public,

            /** modified for BIDS **/
            type:        'folder',
            downloads:   project.counter ? project.counter : 0,
            children:    files,
            description: this.formatDescription(project.metadata, description),
            attachments: attachments,
            status:      this.formatStatus(project.tags),
            // userOwns:    this.userOwns(project),
            userCreated: this.userCreated(project),
            access:      this.userAccess(project)
        };
        dataset.authors = dataset.description.Authors;
        dataset.sharedWithMe = dataset.userOwns && !dataset.userCreated;
        if (project.original) {dataset.original = project.original}

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
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
     * Filter Sessions
     *
     * Takes a list of scitran sessions and a subjectID
     * and calls back with a list of BIDS sessions in
     * that subject.
     */
    filterSessions (scitranSessions, subjectId, callback) {
        let sessions = [];
        async.each(scitranSessions, (session, cb) => {
            if (session.subject.code === subjectId) {
                session.children = session.files;
                session.name = session.label;
                sessions.push(session);
                cb();
            } else {
                cb();
            }
        }, () => {
            sessions.sort((a, b) => {
                let aLabel = a.label.toLowerCase();
                let bLabel = b.label.toLowerCase();
                if (aLabel < bLabel) {return -1;}
                else if (aLabel > bLabel) {return 1;}
                else {return 0;}
            });
            callback(sessions);
        });
    },

    /**
     * Get Modalities
     *
     * Get all BIDS modalities for a session.
     */
    getModalities(sessionId, callback) {
        scitran.getAcquisitions(sessionId, (modalities) => {
            modalities.sort((a, b) => {
                let aLabel = a.label.toLowerCase();
                let bLabel = b.label.toLowerCase();
                if (aLabel < bLabel) {return -1;}
                else if (aLabel > bLabel) {return 1;}
                else {return 0;}
            });
            callback(modalities);
        });
    },

    /**
     * Get Datasets
     *
     * Returns a list of datasets including any
     * derived statuses and notes on each. Only returns
     * the top level 'project' container. Takes an optional
     * boolean as second argument to specifiy if request
     * is made with authentication. Defaults to true.
     */
    getDatasets (callback, isPublic, isSignedOut) {
        scitran.getProjects({authenticate: !isPublic, snapshot: isPublic}, (projects) => {
            scitran.getUsers((err, res) => {
                let users = !err && res && res.body ? res.body : null;
                let results = [];
                let publicResults = {};
                // hide other user's projects from admins & filter snapshots to display newest of each dataset
                if (projects) {
                    for (let project of projects) {
                        let dataset = this.formatDataset(project, null, users);
                        if (isPublic) {
                            if (!publicResults.hasOwnProperty(project.original) || publicResults[project.original].snapshot_version < project.snapshot_version) {
                                publicResults[project.original] = dataset;
                            }
                        } else if (this.userAccess(project)) {
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
            }, isSignedOut);
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
        scitran.getUsers((err, res) => {
            let users = !err && res && res.body ? res.body : null;
            scitran.getProject(projectId, (res) => {
                if (res.status !== 200) {return callback(res);}
                let project = res.body;
                this.getMetadata(project, (metadata) => {
                    let dataset = this.formatDataset(project, metadata['dataset_description.json'], users);
                    dataset.README = metadata.README;
                    crn.getDatasetJobs(projectId, (err, res) => {
                        dataset.jobs = res.body;
                        this.usage(projectId, options, (usage) => {
                            if (usage) {
                                dataset.views = usage.views;
                                dataset.downloads = usage.downloads;
                            }
                            callback(dataset);
                        });
                    }, options);
                }, options);
            }, options);
        }, options && options.isPublic);
    },

    /**
     * Get Dataset Tree
     *
     * Takes a projectId and returns the full
     * dataset tree.
     */
    getDatasetTree (dataset, callback, options) {
        dataset = {
            _id: dataset._id,
            label: dataset.label,
            children: dataset.children,
            showChildren: true,
            containerType: dataset.containerType,
            type: 'folder'
        };
        let projectId = dataset._id;
        scitran.getSessions(projectId, (scitranSessions) => {
            this.filterSessions(scitranSessions, 'subject', (subjects) => {
                dataset.containerType = 'projects';
                dataset.children = this.formatFiles(dataset.children, projectId, 'projects');
                dataset.children = dataset.children.concat(subjects);
                async.each(subjects, (subject, cb) => {
                    this.filterSessions(scitranSessions, subject._id, (sessions) => {
                        subject.containerType = 'sessions';
                        subject.children = this.formatFiles(subject.children, subject._id, 'sessions');
                        subject.children = subject.children.concat(sessions);
                        async.each(sessions, (session, cb1) => {
                            this.getModalities(session._id, (modalities) => {
                                session.containerType = 'sessions';
                                session.children = this.formatFiles(session.children, session._id, 'sessions');
                                session.children = session.children.concat(modalities);
                                async.each(modalities, (modality, cb2) => {
                                    modality.containerType = 'acquisitions';
                                    modality.children = modality.files;
                                    modality.children = this.formatFiles(modality.children, modality._id, 'acquisitions');
                                    modality.name = modality.label;
                                    cb2();
                                }, cb1);
                            }, options);
                        }, cb);
                    });
                }, () => {
                    callback([dataset]);
                });
            });
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
                    crn.deleteDatasetJobs(projectId, () => {
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
     * User
     *
     * Takes a dataset and users list and returns the
     * user object of the uploader.
     */
    user (dataset, users) {
        if (users) {
            for (let user of users) {
                if (user._id === dataset.group) {
                    return user;
                }
            }
        } else {
            return null;
        }
    },

    /**
     * Format Files
     *
     * Sorts files alphabetically and adds parentId
     * and container properties.
     */
    formatFiles (items, parentId, parentContainer) {
        items = items ? items : [];
        items.sort((a, b) => {
            let aName = a.name.toLowerCase();
            let bName = b.name.toLowerCase();
            if (aName < bName) {return -1;}
            else if (aName > bName) {return 1;}
            else {return 0;}
        });
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
            validation:  project.metadata && project.metadata.validation ? project.metadata.validation : {errors:[], warnings:[]},
            type:        'folder',
            children:    files,
            description: this.formatDescription(project.metadata, description),
            attachments: attachments,
            userCreated: this.userCreated(project),
            access:      this.userAccess(project),
            summary:     this.formatSummary(project.tags)
        };
        dataset.status       = this.formatStatus(project, dataset.access),
        dataset.authors      = dataset.description.Authors;
        dataset.user         = this.user(dataset, users);
        if (project.original) {dataset.original = project.original;}
        if (project.snapshot_version) {dataset.snapshot_version = project.snapshot_version;}
        return dataset;
    },

    /**
     * formatDescription
     *
     */
    formatDescription (metadata, description) {
        description = description ? description : {
            'Name': '',
            'License': '',
            'Authors': [],
            'Acknowledgements': '',
            'HowToAcknowledge': '',
            'Funding': '',
            'ReferencesAndLinks': '',
            'DatasetDOI': ''
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
    formatStatus (project, userAccess) {
        let tags = project.tags ? project.tags : [];
        let status = {
            incomplete: tags.indexOf('incomplete') > -1,
            validating: tags.indexOf('validating') > -1,
            invalid:    tags.indexOf('invalid')    > -1,
            public:     !!project.public,
            hasPublic:  tags.indexOf('hasPublic')  > -1,
            shared:     userStore.data.scitran && (project.group != userStore.data.scitran._id)  &&  !!userAccess
        };
        return status;
    },

    /**
     * Format Summary
     *
     * Takes a tags array and parses the
     * dataset summary if one is present.
     */
    formatSummary (tags, userAccess) {
        let tags = tags ? tags : [];
        for (let tag of tags) {
            if (tag.indexOf('summary-') > -1) {
                return JSON.parse(tag.replace('summary-', ''));
            }
        }
        return null;
    },

    /**
     * User Access
     *
     * Takes a project and returns the level of access
     * the current user has with that project.
     */
    userAccess (project) {
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
    userCreated (project) {
        if (!userStore.data.scitran) {return false;}
        return project.group === userStore.data.scitran._id;
    },

    /**
     * Usage
     * Takes a snapshotId and snapshot boolean and
     * callsback view and download counts for snapshots.
     */
    usage (snapshotId, options, callback) {
        if (options && options.snapshot) {
            let usage = {};
            scitran.getUsage(snapshotId, {type: 'view', count: true}, (err, res) => {
                usage.views = res.body.count;
                scitran.getUsage(snapshotId, {type: 'download', count: true}, (err1, res1) => {
                    usage.downloads = res1.body.count;
                    callback(usage);
                });
            });
        } else {
            callback();
        }
    }

};
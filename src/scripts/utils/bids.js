import async     from 'async';
import scitran   from './scitran';
import crn       from './crn';
import userStore from '../user/user.store';
import fileUtils from './files';

/**
 * BIDS
 *
 * A library for interactions with the
 * scitran service through BIDS concepts.
 */
export default  {

// Read -----------------------------------------------------------------------------------

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
        scitran.getProjects({authenticate: !isPublic, snapshot: false, metadata: true}, (projects) => {
            scitran.getProjects({authenticate: !isPublic, snapshot: true, metadata: true}, (pubProjects) => {
                projects = projects.concat(pubProjects);
                scitran.getUsers((err, res) => {
                    let users = !err && res && res.body ? res.body : null;
                    let resultDict = {};
                    // hide other user's projects from admins & filter snapshots to display newest of each dataset
                    if (projects) {
                        for (let project of projects) {
                            let dataset = this.formatDataset(project, null, users);
                            let datasetId = dataset.hasOwnProperty('original') ? dataset.original : dataset._id;
                            let existing = resultDict[datasetId];
                            if (
                                !existing ||
                                existing.hasOwnProperty('original') && !dataset.hasOwnProperty('original') ||
                                existing.hasOwnProperty('original') && existing.snapshot_version < project.snapshot_version
                            ) {
                                if (isPublic || this.userAccess(project)){
                                    resultDict[datasetId] = dataset;
                                }
                            }
                        }
                    }

                    let results = [];
                    for (let key in resultDict) {
                        results.push(resultDict[key]);
                    }
                    callback(results);
                }, isSignedOut);
            });
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
                let tempFiles = this._formatFiles(res.body.files);
                if (res.status !== 200) {return callback(res);}
                let project = res.body;
                this.getMetadata(project, (metadata) => {
                    let dataset = this.formatDataset(project, metadata['dataset_description.json'], users);
                    dataset.README = metadata.README;
                    crn.getDatasetJobs(projectId, (err, res) => {
                        dataset.jobs = res.body;
                        dataset.children = tempFiles;
                        dataset.showChildren = true;
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
     * Format Files
     *
     * Takes a list of files from a dataset and generates
     * the file tree using file paths.
     */
    _formatFiles(files) {
        let fileList = [];
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let file = files[i];

                if (!file.tags || file.tags.indexOf('attachment') == -1) {
                    fileList[i] = {
                        name: file.name.replace(/%2F/g, '/').replace(/%20/g, ' '),
                        webkitRelativePath: file.name.replace(/%2F/g, '/').replace(/%20/g, ' ')
                    };
                }
            }
        }
        let fileTree = fileUtils.generateTree(fileList);
        return fileTree;
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
        options.query = {purge: true};
        scitran.deleteContainer('projects', projectId, callback, options);
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
            summary:     project.metadata && project.metadata.summary ? project.metadata.summary : null
        };
        dataset.status             = this.formatStatus(project, dataset.access),
        dataset.authors            = dataset.description.Authors;
        dataset.referencesAndLinks = dataset.description.ReferencesAndLinks;
        dataset.user               = this.user(dataset, users);
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
            'ReferencesAndLinks': [],
            'DatasetDOI': ''
        };

        if (metadata && metadata.authors) {
            description.Authors = metadata.authors;
        }

        if (metadata && metadata.referencesAndLinks) {
            description.ReferencesAndLinks = metadata.referencesAndLinks;
        }

        if (typeof description.ReferencesAndLinks === 'string') {
            description.ReferencesAndLinks = [description.ReferencesAndLinks];
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
     * User Access
     *
     * Takes a project and returns the level of access
     * the current user has with that project.
     */
    userAccess (project) {
        let access = null;
        const currentUser = userStore.data.scitran ? userStore.data.scitran._id : null;
        if (project) {
            if (project.permissions && project.permissions.length > 0) {
                for (let user of project.permissions) {
                    if (currentUser === user._id) {
                        access = user.access;
                    }
                }
            } else if (project.group === currentUser) {
                access = 'orphaned';
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
            scitran.getUsage(snapshotId, {query: {type: 'view', count: true}, snapshot: true}, (err, res) => {
                usage.views = res.body.count;
                scitran.getUsage(snapshotId, {query: {type: 'download', count: true}, snapshot: true}, (err1, res1) => {
                    usage.downloads = res1.body.count;
                    callback(usage);
                });
            });
        } else {
            callback();
        }
    }

};
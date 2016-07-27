// dependencies ----------------------------------------------------------------------

import Reflux      from 'reflux';
import React       from 'react';
import Actions     from './dataset.actions.js';
import scitran     from '../utils/scitran';
import crn         from '../utils/crn';
import bids        from '../utils/bids';
import router      from '../utils/router-container';
import userStore   from '../user/user.store';
import uploadStore from '../upload/upload.store';
import userActions from '../user/user.actions';
import upload      from '../utils/upload';
import config      from '../../../config';
import files       from '../utils/files';
import request     from '../utils/request';
import moment      from 'moment';

let datasetStore = Reflux.createStore({

// store setup -----------------------------------------------------------------------

    listenables: Actions,

    init: function () {
        this.setInitialState();
        this.loadApps();
        this.listenTo(uploadStore, (data) => {
            if (data.projectId !== this.data.currentUploadId) {
                this.update({currentUploadId: data.projectId});
            }
        });
    },

    getInitialState: function () {
        return this.data;
    },

// data ------------------------------------------------------------------------------

    data: {},

    update: function (data, callback) {
        for (let prop in data) {this.data[prop] = data[prop];}
        this.trigger(this.data, callback);
    },

    /**
     * Set Initial State
     *
     * Sets the state to the data object defined
     * inside the function. Also takes a diffs object
     * which will set the state to the initial state
     * with any differences passed.
     */
    setInitialState: function (diffs) {
        let data = {
            apps: [],
            currentUpdate: null,
            currentUploadId: null,
            dataset: null,
            datasetTree: null,
            displayFile: {
                name: '',
                text: ''
            },
            loading: false,
            loadingApps: false,
            loadingJobs: false,
            loadingTree: false,
            jobs: [],
            metadataIssues: {},
            modals: {
                displayFile: false,
                jobs:        false,
                publish:     false,
                share:       false,
                update:      false
            },
            snapshot: false,
            snapshots: [],
            selectedSnapshot: '',
            status: null,
            users: [],
            showSidebar: window.localStorage.hasOwnProperty('showSidebar')? window.localStorage.showSidebar === 'true' : true
        };
        for (let prop in diffs) {data[prop] = diffs[prop];}
        this.update(data);
    },

// Actions ---------------------------------------------------------------------------

    // Dataset -----------------------------------------------------------------------

    /**
     * Load Dataset
     *
     * Takes a datasetId and loads the dataset.
     */
    loadDataset(datasetId, options) {
        let snapshot = !!(options && options.snapshot),
            dataset  = this.data.dataset;
        options      = options ? options : {};
        options.isPublic = !userStore.data.token;

        // update selection & current upload data
        this.update({selectedSnapshot: datasetId, currentUploadId: uploadStore.data.projectId});

        // don't reload the current dataset
        if (dataset && dataset._id === datasetId) {this.update({loading: false}); return;}

        // begin loading
        this.update({loading: true, loadingJobs: true, datasetTree: null});
        bids.getDataset(datasetId, (res) => {
            if (res.status === 404 || res.status === 403) {
                this.update({status: res.status, dataset: null, loading: false, snapshot: snapshot});
            } else {
                // don't update data if the user has selected another version during loading
                let selectedSnapshot = this.data.selectedSnapshot;
                if (!selectedSnapshot || selectedSnapshot === datasetId) {
                    let dataset = res;
                    this.update({dataset});
                    let originalId = dataset.original ? dataset.original : datasetId;
                    this.loadJobs(datasetId, snapshot, originalId, (jobs) => {
                        this.loadSnapshots(dataset, jobs, () => {
                            this.update({loading: false, snapshot: snapshot});
                        });
                    });
                }
            }
        }, options);
    },

    /**
     * Load Dataset Tree
     */
    loadDatasetTree() {
        this.update({loadingTree: true});
        bids.getDatasetTree(this.data.dataset, (tree) => {
            this.update({loadingTree: false, datasetTree: tree});
        }, {snapshot: this.data.snapshot});
    },

    /**
     * Load Snapshot
     *
     * Takes a snapshot ID and loads the snapshot.
     */
    loadSnapshot(isOriginal, snapshotId) {
        let datasetId = this.data.dataset.original ? this.data.dataset.original : this.data.dataset._id;
        if (isOriginal) {
            router.transitionTo('dataset', {datasetId: snapshotId});
        } else {
            router.transitionTo('snapshot', {datasetId, snapshotId});
        }
    },

    /**
     * Reload Dataset
     *
     * Optionally takes a datasetId and only reloads
     * the dataset if that ID matches the current ID.
     * If no ID is passed it reloads the current ID.
     */
    reloadDataset(datasetId) {
        if (this.data.dataset) {
            if (!datasetId) {
                this.loadDataset(this.data.dataset._id, {snapshot: this.data.snapshot});
            }else if (this.data.dataset._id == datasetId) {
                this.loadDataset(datasetId);
            }
        }
    },

    /**
     * Load Users
     *
     * Loads a list of all users.
     */
    loadUsers() {
        scitran.getUsers((err, res) => {
            this.update({users: res.body});
        });
    },

    /**
     * Load Apps
     */
    loadApps() {
        this.update({loadingApps: true});
        crn.getApps((err, res) => {
            if (res.body) {
                res.body.sort((a, b) => {
                    let aName = a.label.toUpperCase();
                    let bName = b.label.toUpperCase();
                    return (aName < bName) ? -1 : (aName > bName) ? 1 : 0;
                });
            }
            this.update({apps: res.body, loadingApps: false});
        });
    },

    /**
     * Publish
     *
     * Takes a snapshotId, value and callback and sets the
     * datasets public status to the passed value.
     */
    publish(snapshotId, value, callback) {
        let datasetId = this.data.snapshot ? this.data.dataset.original : this.data.dataset._id;

        // check if public snapshots exist outside of current
        let hasPublic = false;
        for (let snapshot of this.data.snapshots) {
            if (snapshot._id === snapshotId) {continue;}
            if (snapshot.public) {
                hasPublic = true;
            }
        }

        scitran.updateSnapshotPublic(snapshotId, value, (err) => {
            if (callback) {callback();}
            if (!err) {
                let dataset = this.data.dataset;
                if (value) {
                    if (!hasPublic) {
                        scitran.addTag('projects', datasetId, 'hasPublic', () => {});
                    }
                    if (snapshotId === this.data.dataset._id) {
                        dataset.status.public = value;
                    } else {
                        router.transitionTo('snapshot', {datasetId, snapshotId});
                    }
                } else {
                    if (!hasPublic) {
                        scitran.removeTag('projects', datasetId, 'hasPublic', () => {});
                    }
                    dataset.status.public = value;
                }
                let snapshots = this.data.snapshots;
                for (let snapshot of snapshots) {
                    if (snapshot._id === snapshotId) {
                        snapshot.public = value;
                    }
                }
                this.update({dataset, snapshots});
            }
        });
    },

    getDatasetDownloadTicket(callback) {
        scitran.getBIDSDownloadTicket(this.data.dataset._id, (err, res) => {
            let ticket = res.body.ticket;
            let downloadUrl = res.req.url.split('?')[0] + '?ticket=' + ticket;
            callback(downloadUrl);
        }, {snapshot: !!this.data.snapshot});
    },

    /**
     * Track Download
     *
     * Tracks download and increments download
     * count (client side only) to provide immediate
     * download feedback.
     */
    trackDownload(callback) {
        scitran.trackUsage(this.data.dataset._id, 'download', {snapshot: true}, () => {
            let dataset = this.data.dataset;
            dataset.downloads++;
            this.update({dataset});
            callback();
        });
    },

    /**
     * Delete Dataset
     *
     * Takes a datsetId, deletes the dataset, and returns the user
     * to the my datasets page.
     */
    deleteDataset(datasetId, callback) {
        if (this.data.snapshot) {
            bids.deleteDataset(datasetId, () => {
                router.transitionTo('datasets');
            }, {snapshot: this.data.snapshot});
        } else {
            let message = 'You are about to delete this dataset. This will delete your draft and any unpublished snaphots. Any published snapshots for this dataset will remain publicly accessible. To remove public snapshots please contact the site administrator.';
            this.updateWarn({
                alwaysWarn:   true,
                confirmTxt:   'Delete',
                hideDontShow: true,
                message:      message,
                action:       () => {
                    this.update({loading: 'deleting'});
                    bids.deleteDataset(datasetId, () => {
                        router.transitionTo('datasets');
                    }, {snapshot: this.data.snapshot});
                }
            });
        }
        if (callback) {callback();}
    },

    /**
     * Toggle Modal
     */
    toggleModal(name, callback) {
        let modals = this.data.modals;
        modals[name] = !modals[name];
        this.update({modals});
        if (callback && typeof callback === 'function') {callback();}
    },

    /**
     * Update Status
     */
    updateStatus(projectId, updates) {
        if (this.data.dataset && this.data.dataset._id === projectId) {
            let dataset = this.data.dataset;
            for (let prop in updates) {
                if (dataset.status.hasOwnProperty(prop)) {
                    dataset.status[prop] = updates[prop];
                }
            }
            this.update({dataset});
        }
    },


    // Metadata ----------------------------------------------------------------------

    /**
     * Update Modified
     *
     * Updated the last modified date for the current
     * dataset (client-side only).
     */
    updateModified() {
        let dataset = this.data.dataset;
        dataset.modified = moment().format();
        this.update({dataset});
    },

    updateName(value, callback) {
        scitran.updateProject(this.data.dataset._id, {label: value}, () => {
            // update description
            this.updateDescription('Name', value, callback);

            // update filetree
            let dataset     = this.data.dataset;
            let datasetTree = this.data.datasetTree;
            dataset.label = value;
            if (datasetTree && datasetTree[0]) {
                datasetTree[0].label = value;
            }
            this.update({dataset, datasetTree});
        });
    },

    /**
     * Update Description
     *
     * Takes a key and a value and updates the dataset
     * description JSON note accordingly.
     */
    updateDescription(key, value, callback) {
        let dataset = this.data.dataset;
        let metadataIssues = this.data.metadataIssues;
        let description = dataset.description;
        description[key] = value;
        if (key !== 'Authors') {
            description.Authors = dataset.authors;
        } else {
            metadataIssues.authors = null;
        }
        this.saveDescription(description, callback);
        this.update({dataset, metadataIssues});
    },

    /**
     * Update Description File
     *
     * Helper method to make necessary state and metadata
     * changes after a description file is uploaded,
     * deleted or added.
     */
    updateDescriptionFile(file, projectId, callback) {
        files.read(file, (contents) => {
            let description = JSON.parse(contents);
            let authors = [];
            if (description.hasOwnProperty('Authors')) {
                for (let i = 0; i < description.Authors.length; i++) {
                    let author = description.Authors[i];
                    authors.push({name: author, ORCIDID: ''});
                }
            }
            scitran.updateProject(projectId, {metadata: {authors}}, () => {
                file = new File([JSON.stringify(description)], 'dataset_description.json', {type: 'application/json'});
                scitran.updateFile('projects', projectId, file, () => {
                    description.Authors = authors;
                    let dataset = this.data.dataset;
                    dataset.description = description;
                    this.update({dataset});
                    this.revalidate();
                    callback();
                });
            });
        });
    },

    /**
     * Save Description
     *
     * Takes a description object and upserts
     * the JSON description file.
     */
    saveDescription(description, callback) {
        description = JSON.parse(JSON.stringify(description));
        let datasetId = this.data.dataset._id;
        scitran.updateProject(datasetId, {metadata: {authors: description.Authors}}, () => {
            let authors = [];
            for (let author of description.Authors) {
                authors.push(author.name);
            }
            description.Authors = authors;
            this.updateModified();
            scitran.updateFileFromString('projects', datasetId, 'dataset_description.json', JSON.stringify(description), 'application/json', ['project'], callback);
        });
    },

    /**
     * Update README
     */
    updateREADME(value, callback) {
        let dataset = this.data.dataset;
        scitran.updateFileFromString('projects', this.data.dataset._id, 'README', value, '', [], (err, res) => {
            callback(err, res);
            dataset.README = value;
            this.update({dataset});
            this.updateModified();
        });
    },

    /**
     * Dismiss Metadata Issue
     */
    dismissMetadataIssue(key) {
        let metadataIssues = this.data.metadataIssues;
        metadataIssues[key] = null;
        this.update({metadataIssues});
    },

    // Attachments -------------------------------------------------------------------

    /**
     * Upload Attachment
     *
     * Takes a file and a callback and uploads
     * the file to the current dataset.
     */
    uploadAttachment(file, callback) {
        let attachmentExists, fileExists;
        for (let attachment of this.data.dataset.attachments) {
            if (attachment.name === file.name) {
                attachmentExists = true;
            }
        }

        for (let existingFile of this.data.dataset.children) {
            if (existingFile.name === file.name) {
                fileExists = true;
            }
        }

        if (attachmentExists) {
            callback({error: '"' + file.name + '" has already been uploaded. Multiple attachments with the same name are not allowed.'});
        } else if (fileExists) {
            callback({error: 'You cannot upload a file named "' + file.name + '" as an attachment because it already exists in the dataset.'});
        } else {
            let request = {
                url: config.scitran.url + 'projects/' + this.data.dataset._id + '/files',
                file: file,
                tags: ['attachment'],
                progressStart: () => {},
                progressEnd: () => {
                    bids.getDataset(this.data.dataset._id, (res) => {
                        let dataset = this.data.dataset;
                        dataset.attachments = res.attachments;
                        this.update({dataset: dataset});
                        callback();
                    });
                },
                error: () => {
                    callback({error: 'There was an error uploading your attachment. Please try again and contact the site administrator if the issue persists.'});
                }
            };
            upload.add(request);
            this.updateModified();
        }
    },

    /**
     * Delete Attachment
     *
     * Takes a filename and index and deletes
     * the attachment from the current dataset.
     */
    deleteAttachment(filename, index) {
        scitran.deleteFile('projects', this.data.dataset._id, filename, () => {
            let dataset = this.data.dataset;
            dataset.attachments.splice(index, 1);
            this.update({dataset});
            this.updateModified();
        });
    },

    /**
     * Get Attachment Download Ticket
     *
     * Takes a filename and callsback with a direct
     * download url for an attachment.
     */
    getAttachmentDownloadTicket(filename, callback) {
        scitran.getDownloadTicket('projects', this.data.dataset._id, filename, (err, res) => {
            let ticket = res.body.ticket;
            let downloadUrl = res.req.url.split('?')[0] + '?ticket=' + ticket;
            callback(downloadUrl);
        }, {snapshot: !!this.data.snapshot});
    },

    // File Structure ----------------------------------------------------------------

    /**
     * Update Warning
     *
     * Throws a modal to warn the user about consequences of
     * dataset modifications.
     */
    updateWarn(options) {
        userActions.getPreferences((preferences) => {
            if (preferences && preferences.ignoreUpdateWarnings && !options.alwaysWarn) {
                options.action();
            } else {
                let modals = this.data.modals;
                modals.update = true;
                this.update({
                    currentUpdate: {
                        action:       options.action,
                        hideDontShow: options.hideDontShow,
                        message:      options.message,
                        confirmTxt:   options.confirmTxt
                    },
                    modals
                });
            }
        });
    },

    updateMessage(type, file) {
        return <span><span className="text-danger">You are about to {type} {file.name}</span>. This action will run validation again. As a result, your dataset could become invalid. Do you want to continue?</span>;
    },

    /**
     * Disable Update Warning
     *
     * Disables the update warning modal
     */
    disableUpdateWarn(callback) {
        userActions.updatePreferences({ignoreUpdateWarnings: true}, callback);
    },

    /**
     * Add File
     */
    addFile(container, file) {
        let exists;
        for (let existingFile of container.children) {
            if (existingFile.name === file.name) {
                exists = true;
            }
        }
        if (exists) {
            this.updateDirectoryState(container._id, {error: '"' + file.name + '" already exists in this directory.'});
        } else {
            let message = this.updateMessage('add', file);
            this.updateWarn({
                message: message,
                action: () => {
                    this.updateDirectoryState(container._id, {loading: true});
                    if (file.name === 'dataset_description.json' && container.containerType === 'projects') {
                        this.updateDescriptionFile(file, container._id, () => {
                            let children = container.children;
                            children.unshift({
                                filename: file.name,
                                name: file.name,
                                parentContainer: container.containerType,
                                parentId: container._id
                            });
                            this.updateDirectoryState(container._id, {children: children, loading: false});
                        });
                    } else {
                        scitran.updateFile(container.containerType, container._id, file, () => {
                            let children = container.children;
                            children.unshift({
                                filename: file.name,
                                name: file.name,
                                parentContainer: container.containerType,
                                parentId: container._id
                            });
                            this.updateDirectoryState(container._id, {children: children, loading: false});
                            this.revalidate();
                        });
                    }
                }
            });
        }
    },

    /**
     * Delete File
     */
    deleteFile(file, callback) {
        let message = this.updateMessage('delete', file);
        this.updateWarn({
            message: message,
            action: () => {
                let dataset = this.data.dataset;
                let datasetTree = this.data.datasetTree;
                scitran.deleteFile(file.parentContainer, file.parentId, file.name, () => {
                    let match = files.findInTree(datasetTree, file.parentId);
                    let children = [];
                    for (let existingFile of match.children) {
                        if (file.name !== existingFile.name) {
                            children.push(existingFile);
                        }
                    }
                    match.children = children;
                    if (file.name === 'dataset_description.json' && file.parentContainer === 'projects') {
                        dataset.description = {
                            'Name': '',
                            'License': '',
                            'Authors': [],
                            'Acknowledgements': '',
                            'HowToAcknowledge': '',
                            'Funding': '',
                            'ReferencesAndLinks': '',
                            'DatasetDOI': ''
                        };
                        scitran.updateProject(file.parentId, {metadata: {authors: []}}, () => {});
                    }
                    this.update({dataset, datasetTree});
                    this.revalidate();
                });
            }
        });
        if (callback) {callback();}
    },

    /**
     * Update File
     */
    updateFile(item, file) {
        let id       = item.parentId,
            level    = item.parentContainer,
            filename = item.name;

        if (filename !== file.name) {
            this.updateFileState(item, {
                error: 'You must replace a file with a file of the same name.'
            });
        } else {
            let message = this.updateMessage('update', file);
            this.updateWarn({
                message: message,
                action: () => {
                    this.updateFileState(item, {error: null, loading: true});
                    if (file.name === 'dataset_description.json' && level === 'projects') {
                        this.updateDescriptionFile(file, id, () => {
                            this.updateFileState(item, {loading: false});
                        });
                    } else {
                        scitran.updateFile(level, id, file, () => {
                            this.updateFileState(item, {loading: false});
                            this.revalidate();
                        });
                    }
                }
            });
        }
    },

    /**
     * Re Validate
     *
     * Used after any modification and must be run
     * only after the modification is complete. Downloads
     * and validates the dataset server side. Updates status
     * tags and validation results on dataset.
     */
    revalidate() {
        let dataset = this.data.dataset;
        scitran.addTag('projects', dataset._id, 'validating', () => {
            dataset.status.validating = true;
            this.update({dataset});
            crn.validate(dataset._id, (err, res) => {
                let validation = res.body.validation;
                dataset.status.validating = false;
                dataset.validation = validation;
                dataset.summary    = res.body.summary;
                dataset.status.invalid = validation.errors && (validation.errors == 'Invalid' || validation.errors.length > 0);
                this.update({dataset});
                this.updateModified();
            });
        });
    },

    /**
     * Get File Download Ticket
     *
     * Takes a filename and callsback with a
     * direct download url.
     */
    getFileDownloadTicket(file, callback) {
        scitran.getDownloadTicket(file.parentContainer, file.parentId, file.name, (err, res) => {
            let ticket = res.body.ticket;
            let downloadUrl = res.req.url.split('?')[0] + '?ticket=' + ticket;
            callback(downloadUrl);
        }, {snapshot: this.data.snapshot});
    },

    /**
     * Dismiss Error
     */
    dismissError(item) {
        if (item.children) {
            this.updateDirectoryState(item._id, {error: ''});
        } else {
            this.updateFileState(item, {error: ''});
        }
    },

    /**
     * Update Directory State
     *
     */
    updateDirectoryState(directoryId, changes, callback) {
        let datasetTree = this.data.datasetTree;
        let match = files.findInTree(datasetTree, directoryId);
        if (match) {
            for (let key in changes) {
                match[key] = changes[key];
            }
        }
        this.update({datasetTree}, callback);
    },

    /**
     * Update File State
     *
     * Take a file object and changes to be
     * made and applies those changes by
     * updating the state of the file tree
     */
    updateFileState(file, changes, callback) {
        let datasetTree = this.data.datasetTree;
        let parent = files.findInTree(datasetTree, file.parentId);
        for (let existingFile of parent.children) {
            if (file.name == existingFile.name) {
                for (let key in changes) {
                    existingFile[key] = changes[key];
                }
            }
        }
        this.update({datasetTree}, callback);
    },

    /**
     * Toggle Folder
     *
     * Takes the id of a container in the
     * current dataset and toggles its showChildren
     * boolean which determines whether container
     * children are shown in the tree hierarchy UI.
     */
    toggleFolder(directory) {
        if (directory.label === this.data.dataset.label && !this.data.datasetTree) {
            this.loadDatasetTree();
        } else {
            this.updateDirectoryState(directory._id, {showChildren: !directory.showChildren});
        }
    },

    // Jobs --------------------------------------------------------------------------

    /**
     * Load Jobs
     */
    loadJobs(projectId, snapshot, originalId, callback) {
        this.update({loadingJobs: true});
        crn.getDatasetJobs(projectId, (err, res) => {
            let jobs = {};

            // iterate jobs
            for (let job of res.body) {

                // check if job should be polled
                let status     = job.agave.status;
                let failed     = status === 'FAILED';
                let finished   = status === 'FINISHED';
                let hasResults = job.results && job.results.length > 0;
                if (snapshot && (!finished && !failed || finished && !hasResults)) {
                    this.pollJob(job.jobId);
                }

                // sort jobs by app
                if (!jobs.hasOwnProperty(job.appId)) {
                    jobs[job.appId] = {
                        appLabel:   job.appLabel,
                        appVersion: job.appVersion,
                        runs: [job]
                    };
                } else {
                    jobs[job.appId].runs.push(job);
                }
            }

            // convert jobs to array
            let jobArray = [];
            for (let job in jobs) {
                jobArray.push({
                    appId:      job,
                    appLabel:   jobs[job].appLabel,
                    appVersion: jobs[job].appVersion,
                    runs:       jobs[job].runs
                });
            }

            // update jobs state
            this.update({jobs: jobArray, loadingJobs: false});

            // callback with original jobs array
            if (snapshot && callback) {
                crn.getDatasetJobs(originalId, (err1, res1) => {
                    callback(res1.body);
                }, {snapshot: false});
            } else if (callback) {
                callback(res.body);
            }
        }, {snapshot});
    },

    pollJob(jobId) {
        let interval = 5000;
        let poll = (jobId) => {
            this.refreshJob(jobId, (job) => {
                let status = job.agave.status;
                let finished = status === 'FINISHED';
                let failed = status === 'FAILED';
                let hasResults = job.results && job.results.length > 0;
                let needsUpdate = (!finished && !failed) || (finished && !hasResults)
                if (needsUpdate && job.snapshotId === this.data.dataset._id) {
                    setTimeout(poll.bind(this, jobId), interval);
                }
            });
        };
        setTimeout(poll.bind(this, jobId), interval);
    },

    /**
     * Start Job
     */
    startJob(snapshotId, app, parameters, callback) {
        let datasetId = this.data.dataset.original ? this.data.dataset.original : this.data.dataset._id;
        crn.createJob({
            appId:             app.id,
            appLabel:          app.label,
            appVersion:        app.version,
            datasetId:         datasetId,
            datasetLabel:      this.data.dataset.label,
            executionSystem:   app.executionSystem,
            parameters:        parameters,
            snapshotId:        snapshotId,
            userId:            userStore.data.scitran._id,
            batchQueue:        app.defaultQueue,
            memoryPerNode:     app.defaultMemoryPerNode,
            nodeCount:         app.defaultNodeCount,
            processorsPerNode: app.defaultProcessorsPerNode,
            input:             app.inputs[0].id
        }, (err, res) => {
            callback(err, res);
            if (!err) {
                // reload jobs
                if (snapshotId == this.data.dataset._id) {
                    this.loadJobs(snapshotId, this.data.snapshot, datasetId, (jobs) => {
                        this.loadSnapshots(this.data.dataset, jobs);

                        // start polling job
                        let jobId = res.body.result.id;
                        this.pollJob(jobId);
                    });
                }
            }
        });
    },

    refreshJob(jobId, callback) {
        crn.getJob(jobId, (err, res) => {
            let existingJob;
            let jobUpdate =  res ? res.body : null;
            let jobs = this.data.jobs;
            if (jobs && jobs.length > 0) {
                for (let job of jobs) {
                    for (let run of job.runs) {
                        if (jobId === run.jobId) {
                            existingJob = run;
                            if (jobUpdate) {
                                run.agave = jobUpdate.agave;
                                run.results = jobUpdate.results;
                            }
                        }
                    }
                }
                if (this.data.dataset && this.data.dataset._id === jobUpdate.snapshotId) {
                    this.update({jobs});
                }
            }
            callback(jobUpdate ? jobUpdate : existingJob);
        });
    },

    retryJob(jobId, callback) {
        crn.retryJob(jobId, () => {
            this.loadJobs(this.data.dataset._id, true, this.data.dataset.original, (jobs) => {
                this.loadSnapshots(this.data.dataset, jobs);
                callback();
            });
        });
    },

    /**
     * Dismiss Job Modal
     */
    dismissJobsModal(success, snapshotId) {
        this.toggleModal('jobs');
        if (success) {
            if (snapshotId !== this.data.dataset._id) {
                let datasetId = this.data.dataset.original ? this.data.dataset.original : this.data.dataset._id;
                router.transitionTo('snapshot', {datasetId, snapshotId});
            }
        }
    },

    /**
     * Get Result Download Ticket
     */
    getResultDownloadTicket(jobId, filePath, callback) {
        crn.getResultDownloadTicket(jobId, filePath, (err, res) => {
            let ticket      = res.body._id;
            let fileName    = filePath.split('/')[filePath.split('/').length - 1];
            let downloadUrl = config.crn.url + 'jobs/' + jobId + '/results/' + fileName + '?ticket=' + ticket;
            callback(downloadUrl);
        });
    },

    /**
     * DisplayFile
     */
    displayFile(jobId, fileLink, fileName, callback) {
        this.getResultDownloadTicket(jobId, fileLink, (link) => {
            request.get(link, {}, (err, res) => {
                if (callback) {callback();}
                let modals = this.data.modals;
                modals.displayFile = true;
                this.update({
                    displayFile: {
                        name: fileName,
                        text: res.text
                    },
                    modals
                });
            });
        });
    },

    // Snapshots ---------------------------------------------------------------------

    createSnapshot(callback, transition) {
        let datasetId = this.data.dataset.original ? this.data.dataset.original : this.data.dataset._id;
        transition    = transition == undefined ? true : transition;

        scitran.getProject(datasetId, (res) => {
            let project = res.body;
            if (!project.metadata || !project.metadata.authors || project.metadata.authors.length < 1) {
                let metadataIssues = this.data.metadataIssues;
                let message = 'Your dataset must list at least one author before creating a snapshot.';
                metadataIssues.authors = message;
                this.update({metadataIssues});
                callback({error: message});
            } else if (project.metadata.hasOwnProperty('validation') && project.metadata.validation.errors.length > 0) {
                callback({error: 'You cannot snapshot an invalid dataset. Please fix the errors and try again.'});
            } else {
                let latestSnapshot = this.data.snapshots[1];
                if (latestSnapshot && (moment(this.data.dataset.modified).diff(moment(latestSnapshot.modified)) <= 0)) {
                    callback({error: 'No modifications have been made since the last snapshot was created. Please use the most recent snapshot.'});
                } else {
                    scitran.createSnapshot(datasetId, (err, res) => {
                        this.toggleSidebar(true);
                        if (transition) {
                            router.transitionTo('snapshot', {datasetId: this.data.dataset._id, snapshotId: res.body._id});
                        }
                        this.loadSnapshots(this.data.dataset, [], () => {
                            if (callback){callback(res.body._id);}
                        });
                    });
                }
            }
        });
    },

    loadSnapshots(dataset, jobs, callback) {
        let datasetId = dataset.original ? dataset.original : dataset._id;
        scitran.getProjectSnapshots(datasetId, (err, res) => {
            let snapshots = !err && res.body ? res.body : [];

             // sort snapshots
            snapshots.sort((a, b) => {
                if      (a.snapshot_version < b.snapshot_version) {return 1;}
                else if (a.snapshot_version > b.snapshot_version) {return -1;}
                else {return 0;}
            });

            // add job counts
            for (let snapshot of snapshots) {
                snapshot.analysisCount = 0;
                if (jobs && !jobs.error) {
                    for (let job of jobs) {
                        if (job.snapshotId == snapshot._id) {
                            snapshot.analysisCount++;
                        }
                    }
                }

            }

            // add draft is available
            if (dataset && dataset.access !== null) {
                snapshots.unshift({
                    isOriginal: true,
                    _id: datasetId
                });
            }
            this.update({snapshots: snapshots});
            if (callback) {callback();}
        });
    },

    // usage analytics ---------------------------------------------------------------

    trackView (snapshotId) {
        scitran.trackUsage(snapshotId, 'view', {snapshot: true}, () => {});
    },

    // Toggle Sidebar ----------------------------------------------------------------

    toggleSidebar (value) {
        let showSidebar = !this.data.showSidebar;
        if (typeof value === 'boolean') {showSidebar = value;}
        window.localStorage.showSidebar = showSidebar;
        this.update({showSidebar});
    }

});

export default datasetStore;
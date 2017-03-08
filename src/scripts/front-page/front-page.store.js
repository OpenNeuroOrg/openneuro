// dependencies ----------------------------------------------------------------------

import Reflux         from 'reflux';
import actions        from './front-page.actions';
import crn            from '../utils/crn';
import bids           from '../utils/bids';
import files          from '../utils/files';
import datasetActions from '../dataset/dataset.actions';
import request        from '../utils/request';

// store setup -----------------------------------------------------------------------

let FrontPageStore = Reflux.createStore({

    listenables: actions,

    init: function () {
        this.setInitialState();
        bids.getDatasets((datasets) => {
            this.update({datasetCount: datasets.length});
        }, true, true);
    },

    getInitialState: function () {
        return this.data;
    },

// state data ------------------------------------------------------------------------

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
    setInitialState: function (diffs, callback) {
        let data = {
            apps: [],
            datasetCount: null,
            displayFile: {
                name: '',
                text: '',
                link: '',
                show: false
            },
            exampleJob: null,
            loadingJob: false,
            selectedTags: '',
            selectedPipeline: {id: ''},
            tags: []
        };
        for (let prop in diffs) {data[prop] = diffs[prop];}
        this.update(data, callback);
    },

// actions ---------------------------------------------------------------------------

    /**
     * Reset
     */
    reset() {
        this.setInitialState({
            apps: this.data.apps,
            datasetCount: this.data.datasetCount
        });
    },

    /**
     * Set Apps
     */
    setApps (apps) {
        let found = [];
        let tags  = [];

        // collect tags
        for (let app in apps) {
            if (apps[app].tags) {
                for (let tag of apps[app].tags) {
                    if (found.indexOf(tag) === -1) {
                        found.push(tag);
                        tags.push({label: tag, value: tag});
                    }
                }
            }
        }
        this.update({apps, tags});
    },

    /**
     * Select Tag
     */
    selectTag (selectedTags) {
        this.update({selectedTags});
    },

    /**
     * Select Pipeline
     */
    selectPipeline (appId) {
        if (appId === '') {
            this.update({selectedPipeline: {id: ''}});
            return;
        }
        let apps = this.data.apps;
        for (let app of apps) {
            if (app.id === appId) {
                // set selected app
                this.update({selectedPipeline: app, loadingJob: true});
                // load associated example job
                // let description = JSON.parse(app.longDescription);
                // this.loadJob(description.snapshotId, description.jobId);
                if (app.id === 'mriqc-bare-0.8.7') {
                    this.loadJob('57dc3704a76c87000a24e650', '3036461272949658086-242ac115-0001-007');
                } else {
                    this.update({loadingJob: false, exampleJob: null});
                }
                return;
            }
        }
    },

    /**
     * Load Job
     */
    loadJob (snapshotId, jobId) {
        crn.getJob(snapshotId, jobId, (err, res) => {
            this.update({exampleJob: res.body, loadingJob: false});
        }, {snapshot: true});
    },

    /**
     * Toggle Folder
     */
    toggleFolder(directory) {
        let exampleJob = this.data.exampleJob;

        // find directory
        let dir = files.findInTree(exampleJob.results, directory.path, 'path');
        if (dir) {
            dir.showChildren = !dir.showChildren;
        }

        // update state
        this.update({exampleJob});
    },

    /**
     * DisplayFile
     */
    displayFile(snapshotId, jobId, file, callback) {
        datasetActions.getResultDownloadTicket(snapshotId, jobId, file, (link) => {
            // requestAndDisplay(link);

            if (files.hasExtension(file.name, ['.pdf', '.nii.gz', '.jpg', '.jpeg', '.png', '.gif'])) {
                if (callback) {callback();}
                this.update({
                    displayFile: {
                        name: file.name,
                        text: null,
                        link: link,
                        show: true
                    }
                });
            } else {
                request.get(link, {}, (err, res) => {
                    if (callback) {callback();}
                    this.update({
                        displayFile: {
                            name: file.name,
                            text: res.text,
                            link: link,
                            show: true
                        }
                    });
                });
            }
        });
    },

    hideFileDisplay() {
        this.update({
            displayFile: {
                name: '',
                text: '',
                link: '',
                show: false
            }
        });
    }

});

export default FrontPageStore;
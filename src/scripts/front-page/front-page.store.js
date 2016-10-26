// dependencies ----------------------------------------------------------------------

import Reflux  from 'reflux';
import actions from './front-page.actions';
import crn     from '../utils/crn';
import files   from '../utils/files';

// store setup -----------------------------------------------------------------------

let FrontPageStore = Reflux.createStore({

    listenables: actions,

    init: function () {
        this.setInitialState();
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
     * Set Apps
     */
    setApps (apps) {
        let found = [];
        let tags  = [];
        for (let app of apps) {
            for (let tag of app.tags) {
                if (found.indexOf(tag) === -1) {
                    found.push(tag);
                    tags.push({label: tag, value: tag});
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
                this.update({selectedPipeline: app, loadingJob: true});
                this.loadJob('57e04d604d88b0000a3e3ece', '9173401224112172570-242ac115-0001-007');
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
    toggleFolder(directory, jobId) {
        let exampleJob = this.data.exampleJob;

        // find directory
        let dir = files.findInTree(exampleJob.results, directory.path, 'path');
        if (dir) {
            dir.showChildren = !dir.showChildren;
        }

        // update state
        this.update({exampleJob});
    }

});

export default FrontPageStore;
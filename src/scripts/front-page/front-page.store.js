// dependencies ----------------------------------------------------------------------

import Reflux  from 'reflux';
import actions from './front-page.actions.js';

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
            tags: [],
            selectedTags: '',
            selectedPipeline: {id: ''}
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
        let apps = this.data.apps;
        for (let app of apps) {
            if (app.id === appId) {
                this.update({selectedPipeline: app});
                return;
            }
        }
    }


});

export default FrontPageStore;
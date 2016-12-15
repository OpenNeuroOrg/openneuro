// dependencies ----------------------------------------------------------------------

import Reflux     from 'reflux';
import Actions    from './dashboard.jobs.actions.js';
import crn       from '../utils/crn';
import userStore  from '../user/user.store.js';

// store setup -----------------------------------------------------------------------

let DashboardJobStore = Reflux.createStore({

    listenables: Actions,

    init() {
        this.setInitialState();
    },

    getInitialState() {
        return this.data;
    },

// state data ------------------------------------------------------------------------

    data: {},

    update(data, callback) {
        for (let prop in data) {this.data[prop] = data[prop];}
        this.trigger(this.data, () => {
            if (callback) {callback();}
        });
    },

    /**
     * Set Initial State
     *
     * Sets the state to the data object defined
     * inside the function. Also takes a diffs object
     * which will set the state to the initial state
     * with any differences passed.
     */
    setInitialState(diffs) {
        let data = {
            loading: false,
            jobs: [],
            isPublic: false
        };
        for (let prop in diffs) {data[prop] = diffs[prop];}
        this.update(data);
    },

// actions ---------------------------------------------------------------------------

    /**
     * Get Jobs
     *
     * Takes a boolean representing whether the
     * request is for public jobs and gets
     * a list of jobs and sorts by the current
     * sort setting.
     */
    getJobs(isPublic) {
        if (isPublic === undefined) {isPublic = this.data.isPublic;}
        let isSignedOut = !userStore.data.token;
        this.update({loading: true}, () => {
            crn.getJobs((err, res) => {
                this.update({loading: false, jobs: res.body});
            }, isPublic, isSignedOut);
        });
    }

});

export default DashboardJobStore;
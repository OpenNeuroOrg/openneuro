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
            visiblejobs: [],
            isPublic: false,
            sort: {
                value: 'created',
                direction: '+'
            }
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
                this.sort(null, null, res.body);
                // this.update({loading: false, jobs: res.body});
            }, isPublic, isSignedOut);
        });
    },

    propertyOf(o, s) {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        var a = s.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k in o) {
                o = o[k];
            } else {
                return;
            }
        }
        return o;
    },

    /**
     * Sort
     *
     * Takes a value and a direction (+ or -) and
     * sorts the current jobs acordingly.
     */
    sort(value, direction, jobs) {
        value     = value     ? value     : this.data.sort.value;
        direction = direction ? direction : this.data.sort.direction;
        jobs  = jobs  ? jobs  : this.data.jobs;
        jobs  = jobs.sort((a, b) => {

            // format comparison data
            let aVal, bVal;
            if (value === 'label') {
                aVal = a['datasetLabel'].toLowerCase();
                bVal = b['datasetLabel'].toLowerCase();
            } else if (value === 'created') {
                aVal = -Date.parse(a.agave[value]);
                bVal = -Date.parse(b.agave[value]);
            }

            // sort
            if (direction == '+') {
                if (aVal > bVal) {return 1;}
                if (aVal < bVal) {return -1;}
            } else if (direction == '-') {
                if (aVal > bVal) {return -1;}
                if (aVal < bVal) {return 1;}
            }
            return 0;
        });
        this.update({
            jobs,
            visiblejobs: jobs,
            sort: {
                value,
                direction
            },
            loading: false
        });
    }

});

export default DashboardJobStore;
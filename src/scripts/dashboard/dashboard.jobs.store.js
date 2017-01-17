// dependencies ----------------------------------------------------------------------

import Reflux       from 'reflux';
import Actions      from './dashboard.jobs.actions.js';
import crn          from '../utils/crn';
import userStore    from '../user/user.store.js';
import dashUtils    from './dashboard.utils.js';

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
    setInitialState(diffs, callback) {
        let data = {
            apps: [],
            appsLoading: true,
            loading: false,
            jobs: [],
            visiblejobs: [],
            isPublic: false,
            pipelineNameFilter: '',
            pipelineVersionFilter: '',
            sort: {
                value: 'agave.created',
                direction: '+'
            },
            sortOptions: [
                {label: 'Name', property: 'datasetLabel'},
                {label: 'Date', property: 'agave.created', isTimestamp: true}
            ],
            appVersionGroup: []
        };
        for (let prop in diffs) {data[prop] = diffs[prop];}
        this.update(data, callback);
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
        this.setInitialState({loading: true}, () => {
            crn.getJobs((err, res) => {
                for (let app of res.body.availableApps) {app.value = app.label;}
                this.update({apps: res.body.availableApps, appsLoading: false});
                this.sort('agave.created', '+', res.body.jobs, true);
            }, isPublic, isSignedOut);
        });
    },

    /**
     * Sort
     *
     * Takes a value and a direction (+ or -) and
     * sorts the current jobs acordingly.
     */
    sort(value, direction, jobs, isTimestamp) {
        jobs = jobs ? jobs : this.data.jobs;
        dashUtils.sort(jobs, value, direction, isTimestamp);
        this.update({
            jobs,
            visiblejobs: jobs,
            sort: {
                value,
                direction
            },
            loading: false
        });
    },

   /*
    *
    * push versions data to new array
    * for App version Filter on
    * dashboard
    */

    appVersions(pipelineNameFilter){
        let appVersionGroup = [];
        for (let app of this.data.apps) {
            if (app.label === pipelineNameFilter) {
                for (let version of app.versions) {
                    appVersionGroup.push({label: version.version, value: version.version})
                }
            }
        }
        this.update({appVersionGroup});
    },

    /**
     * Select Pipeline Filter
     */
    selectPipelineFilter(pipelineNameFilter) {
        let visiblejobs = [];
        if (pipelineNameFilter === null) {
            visiblejobs = this.data.jobs;
        } else {
            let jobs = this.data.jobs;
            for (let job of jobs) {
                if (job.appLabel === pipelineNameFilter) {
                    visiblejobs.push(job);
                }
            }
        }
        /* add versions to array */
        this.appVersions(pipelineNameFilter);

        this.update({pipelineNameFilter, visiblejobs});
    },

    wordInString(s, word){
      return new RegExp( '\\b' + word + '\\b', 'i').test(s);
    },

    /**
     * Select Version Filter
     */
    selectPipelineVersionFilter(pipelineVersionFilter) {
        let visiblejobs = [];
        if (pipelineVersionFilter === null || pipelineVersionFilter === '') {
            this.selectPipelineFilter(this.data.pipelineNameFilter);
            this.update({pipelineVersionFilter});
        }else {
            let jobs = this.data.jobs;
            for (let job of jobs) {
                if (this.wordInString(pipelineVersionFilter, job.appVersion) && job.appLabel === this.data.pipelineNameFilter) {
                    visiblejobs.push(job);
                }
            }
            this.update({pipelineVersionFilter, visiblejobs});
        }
    }

});

export default DashboardJobStore;
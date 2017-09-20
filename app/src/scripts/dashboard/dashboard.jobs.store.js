// dependencies ----------------------------------------------------------------------

import Reflux from 'reflux'
import Actions from './dashboard.jobs.actions.js'
import crn from '../utils/crn'
import dashUtils from './dashboard.utils.js'

// store setup -----------------------------------------------------------------------

let DashboardJobStore = Reflux.createStore({
  listenables: Actions,

  init() {
    this.setInitialState()
  },

  getInitialState() {
    return this.data
  },

  // state data ------------------------------------------------------------------------

  data: {},

  update(data, callback) {
    for (let prop in data) {
      this.data[prop] = data[prop]
    }
    this.trigger(this.data, () => {
      if (callback) {
        callback()
      }
    })
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
      filter: {
        pipeline: null,
        version: null,
      },
      sort: {
        value: 'analysis.created',
        direction: '+',
        isTimestamp: true,
      },
      sortOptions: [
        { label: 'Name', property: 'jobName' },
        { label: 'Date', property: 'analysis.created', isTimestamp: true },
        { label: 'Dataset', property: 'datasetLabel' },
      ],
      appVersionGroup: [],
    }
    for (let prop in diffs) {
      data[prop] = diffs[prop]
    }
    this.update(data, callback)
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
  getJobs(isPublic, all, filter) {
    if (isPublic === undefined) {
      isPublic = this.data.isPublic
    }
    this.update({ loading: true, filter: filter }, () => {
      crn.getJobs(
        (err, res) => {
          for (let app of res.body.availableApps) {
            app.value = app.label
          }
          this.update({ apps: res.body.availableApps, appsLoading: false })
          this.sort('analysis.created', '+', res.body.jobs, true)
        },
        isPublic,
        all,
      )
    })
  },

  /**
     * Sort
     *
     * Takes a value and a direction (+ or -) and
     * sorts the current jobs acordingly.
     */
  sort(value, direction, jobs, isTimestamp) {
    jobs = jobs ? jobs : this.data.jobs
    let sort = { value, direction, isTimestamp }
    this.filterAndSort(jobs, null, sort)
  },

  /*
    *
    * push versions data to new array
    * for App version Filter on
    * dashboard
    */
  appVersions(pipeline) {
    let appVersionGroup = []
    for (let app of this.data.apps) {
      if (app.label === pipeline) {
        for (let version of app.versions) {
          appVersionGroup.push({
            label: version.version,
            value: version.version,
          })
        }
      }
    }
    this.update({ appVersionGroup })
  },

  /**
     * Select Pipeline Filter
     */
  selectPipelineFilter(pipeline) {
    // add versions to array
    this.appVersions(pipeline)

    // apply pipepline filter
    let filter = this.data.filter
    filter.pipeline = pipeline
    filter.version = null
    this.filterAndSort(null, filter, null)
  },

  /**
     * Select Version Filter
     */
  selectPipelineVersionFilter(version) {
    let filter = this.data.filter
    filter.version = version
    this.filterAndSort(null, filter, null)
  },

  /**
     * Filter and Sort
     *
     * Takes a list of jobs and filter and sort
     * settings and updates the list of visible jobs.
     */
  filterAndSort(jobs, filter, sort) {
    // defaults
    jobs = jobs ? jobs : this.data.jobs
    filter = filter ? filter : this.data.filter
    sort = sort ? sort : this.data.sort

    // filter
    let visiblejobs = []
    if (filter.pipeline === null) {
      visiblejobs = jobs
    } else {
      for (let job of jobs) {
        if (
          job.appLabel === filter.pipeline && // pipeline match
          (!filter.version ||
            new RegExp('\\b' + job.appVersion + '\\b', 'i').test(
              filter.version,
            )) // version match
        ) {
          visiblejobs.push(job)
        }
      }
    }

    // sort
    dashUtils.sort(visiblejobs, sort.value, sort.direction, sort.isTimestamp)

    // update data
    this.update({
      jobs,
      visiblejobs,
      filter,
      sort,
      loading: false,
    })
  },
})

export default DashboardJobStore

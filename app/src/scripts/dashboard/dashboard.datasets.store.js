// dependencies ----------------------------------------------------------------------

import Reflux from 'reflux'
import Actions from './dashboard.datasets.actions.js'
import bids from '../utils/bids'
import userStore from '../user/user.store.js'
import dashUtils from './dashboard.utils.js'

// store setup -----------------------------------------------------------------------

let UploadStore = Reflux.createStore({
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
    this.trigger(this.data)
    if (callback) callback()
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
      datasets: [],
      isPublic: false,
      isAdmin: false,
      visibleDatasets: [],
      resultsPerPage: 30,
      page: 0,
      sort: {
        value: 'created',
        direction: '+',
      },
      sortOptions: [
        { label: 'Name', property: 'label' },
        { label: 'Date', property: 'created', isTimestamp: true },
        { label: 'User', property: 'user.lastname' },
      ],
      filters: [],
    }
    for (let prop in diffs) {
      data[prop] = diffs[prop]
    }
    this.update(data)
  },

  // actions ---------------------------------------------------------------------------

  /**
   * Get Datasets
   *
   * Takes a boolean representing whether the
   * request is for public datasets and gets
   * a list of datasets and sorts by the current
   * sort setting.
   */
  getDatasets(isPublic, isAdmin) {
    if (typeof isPublic === 'undefined') {
      isPublic = this.data.isPublic
    }
    if (typeof isAdmin === 'undefined') {
      isAdmin = false
    }
    let isSignedOut = !userStore.data.token
    this.update(
      {
        loading: true,
        sort: {
          value: 'created',
          direction: '+',
        },
        filters: [],
      },
      () => {
        bids.getDatasets(
          datasets => {
            if (!isAdmin && !isPublic) {
              datasets = datasets.filter(dataset => {
                if (dataset.group && userStore.data && userStore.data.profile) {
                  return dataset.group === userStore.data.profile._id
                } else {
                  return false
                }
              })
            }
            if (isPublic === this.data.isPublic) {
              this.sort('created', '+', datasets, true)
            }
          },
          isPublic,
          isSignedOut,
          isAdmin,
        )
      },
    )
  },

  /**
   * Filter
   *
   * Takes a value and toggles whether datasets
   * with that value are shown.
   */
  filter(value) {
    // set filters
    let filters = this.data.filters
    let index = filters.indexOf(value)
    if (value === 'reset') {
      filters = []
    } else if (index > -1) {
      filters = []
    } else {
      filters = [value]
    }

    // filter data
    let visibleDatasets = this.data.datasets
    if (filters.length > 0) {
      let results = []
      for (let dataset of visibleDatasets) {
        // public
        if (filters.indexOf('public') > -1 && dataset.status.hasPublic) {
          results.push(dataset)
        }

        // incomplete
        if (filters.indexOf('incomplete') > -1 && dataset.status.incomplete) {
          results.push(dataset)
        }

        // shared
        if (
          filters.indexOf('shared') > -1 &&
          dataset.access &&
          !dataset.userCreated
        ) {
          results.push(dataset)
        }
        // invalid
        if (filters.indexOf('invalid') > -1 && dataset.status.invalid) {
          results.push(dataset)
        }
      }
      visibleDatasets = results
    }

    // update state
    this.update({ filters, visibleDatasets })
  },

  /**
   * Sort
   *
   * Takes a value and a direction (+ or -) and
   * sorts the current datasets acordingly.
   */
  sort(value, direction, datasets, isTimeStamp) {
    datasets = datasets ? datasets : this.data.datasets
    dashUtils.sort(datasets, value, direction, isTimeStamp)
    this.update({
      datasets,
      visibleDatasets: datasets,
      sort: {
        value,
        direction,
      },
      loading: false,
    })
  },
})

export default UploadStore

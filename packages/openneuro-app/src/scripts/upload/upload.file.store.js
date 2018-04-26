// dependencies ----------------------------------------------------------------------

import Reflux from 'reflux'
import Actions from './upload.file.actions.js'

// store setup -----------------------------------------------------------------------

let UploadFileStore = Reflux.createStore({
  listenables: Actions,

  init: function() {
    this.setInitialState()
  },

  getInitialState: function() {
    return this.data
  },

  // state data ------------------------------------------------------------------------

  data: {},

  update: function(data, callback) {
    for (let prop in data) {
      this.data[prop] = data[prop]
    }
    this.trigger(this.data, callback)
  },

  /**
     * Set Initial State
     *
     * Sets the state to the data object defined
     * inside the function. Also takes a diffs object
     * which will set the state to the initial state
     * with any differences passed.
     */
  setInitialState: function(diffs, callback) {
    let data = {
      list: {},
      tree: [],
    }
    for (let prop in diffs) {
      data[prop] = diffs[prop]
    }
    this.update(data, callback)
  },

  // actions ---------------------------------------------------------------------------

  /**
     * Set Files
     */
  setFiles(selectedFiles) {
    this.update({
      tree: selectedFiles.tree,
      list: selectedFiles.list,
    })
  },

  /**
     * Get Files
     */
  getFiles(format, callback) {
    callback(this.data[format])
  },
})

export default UploadFileStore

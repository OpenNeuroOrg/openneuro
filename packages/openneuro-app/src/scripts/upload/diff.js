export default {
  progress: [],

  /**
     * Datasets
     *
     * Takes two tree structured datasets and callbacks with
     * a dataset tree of the items the first contains and the
     * second doesn't as well as an array or item names to mark
     * as completed progress.
     */
  datasets(newSubjects, oldSubjects, callback) {
    this.progress = []
    callback(this.diff(newSubjects, oldSubjects), this.progress)
  },

  /**
     * Diff
     *
     * Takes an array of new dataset items and an array
     * of old datasets and recursively finds and returns
     * the diffs.
     */
  diff(newItems, oldItems) {
    let diffItems = []
    for (let i = 0; i < newItems.length; i++) {
      let newItem = newItems[i]
      let oldItem = this.contains(oldItems, newItem)
      if (oldItem) {
        this.progress.push(newItem.name)
      } else {
        diffItems.push(newItem)
      }
    }
    return diffItems
  },

  /**
     * Contains
     *
     * Takes an array of container children and
     * an element. Checks if the element already
     * exists in the array and return the match
     * from the array.
     */
  contains(arr, elem) {
    let match = null
    for (let i = 0; i < arr.length; i++) {
      let arrayElem = arr[i]
      let arrayElemPath = arrayElem.name.replace(/%2F/g, '/')
      if ('/' + arrayElemPath === elem.relativePath) {
        match = arrayElem
      }
    }
    return match
  },
}

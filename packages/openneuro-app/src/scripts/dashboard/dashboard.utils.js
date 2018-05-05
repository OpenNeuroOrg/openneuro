/**
 * Dashboard Utilities
 */

export default {
  /**
   * Property Of
   *
   * Takes and object and a stringified property path
   * like "types[3].name" and returns the corresponding
   * value.
   */
  propertyOf(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
    s = s.replace(/^\./, '') // strip a leading dot
    var a = s.split('.')
    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i]
      if (k in o) {
        o = o[k]
      } else {
        return
      }
    }
    return o
  },

  /**
   * Sort
   *
   * Arguments
   * - list:        an array to sort
   * - property:    the stringified property path to sort on
   * - direction:   a "+" or "-" string to define the sort direction
   * - type: a string, possible values: 'timestamp', 'number', or 'string'
   */
  sort(list, property, direction, type) {
    list.sort((a, b) => {
      // format comparison data
      let aVal, bVal
      if (type === 'timestamp') {
        aVal = -Date.parse(this.propertyOf(a, property))
        bVal = -Date.parse(this.propertyOf(b, property))
      } else if (type === 'number') {
        aVal = parseInt(this.propertyOf(a, property))
        bVal = parseInt(this.propertyOf(b, property))
      } else {
        aVal = this.propertyOf(a, property).toLowerCase()
        bVal = this.propertyOf(b, property).toLowerCase()
      }

      // sort
      if (direction == '+') {
        if (aVal > bVal) {
          return 1
        }
        if (aVal < bVal) {
          return -1
        }
      } else if (direction == '-') {
        if (aVal > bVal) {
          return -1
        }
        if (aVal < bVal) {
          return 1
        }
      }
      return 0
    })
  },
}

import Reflux from 'reflux'
import Actions from './tableeditor.actions.js'
import files from '../../../utils/files'
import update from 'immutability-helper'
const PropTypes = require('prop-types')
// next line is only required until ron-react-autocomplete is rebuilt and republished
require('react').PropTypes = PropTypes
require('react').createClass = require('create-react-class')
const { Data: { Selectors } } = require('react-data-grid-addons')

let TableEditorStore = Reflux.createStore({
  // store setup -------------------------------------------------------------------

  listenables: Actions,

  init: function() {
    this.setInitialState()
  },

  getInitialState: function() {
    return this.data
  },

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
  setInitialState: function(diffs) {
    let data = {
      rows: [],
      originalData: [],
      columns: [],
      filters: {},
      clickedCell: null,
      toggleFilter: false,
      editing: false,
      fileName: '',
      editable: false,
      ready: false,
      onSave: null,
      originalFile: null,
    }
    for (let prop in diffs) {
      data[prop] = diffs[prop]
    }
    this.update(data)
  },

  // Actions ---------------------------------------------------------------------------

  // TableEditor ---------------------------------------------------------------------------

  getRows() {
    return Selectors.getRows(this.data)
  },

  rowGetter(i) {
    let rows = this.getRows()
    return rows[i]
  },

  getSize() {
    let rows = this.getRows()
    return rows.length
  },

  findRow(row_obj) {
    return this.data.rows.indexOf(row_obj)
  },

  handleGridRowsUpdated({ fromRow, toRow, updated }) {
    let filteredRows = this.getRows()
    let rows = this.data.rows
    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = filteredRows[i]
      let originalIdx = this.findRow(rowToUpdate)
      let updatedRow = update(rowToUpdate, { $merge: updated })
      filteredRows[i] = updatedRow
      rows[originalIdx] = updatedRow
    }
    this.update({ rows: rows })
  },

  handleGridSort(sortColumn, sortDirection) {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return a[sortColumn] > b[sortColumn] ? 1 : -1
      } else if (sortDirection === 'DESC') {
        return a[sortColumn] < b[sortColumn] ? 1 : -1
      }
    }
    let rows = null
    if (sortDirection === 'NONE') {
      rows = this.getRows()
    } else {
      rows = this.getRows().sort(comparer)
    }
    let clickedCell = null
    this.update({ rows: rows, clickedCell: clickedCell })
  },

  handleFilterChange(filter) {
    let newFilters = Object.assign({}, this.data.filters)
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter
    } else {
      delete newFilters[filter.column.key]
    }
    let cellClicked = null
    this.update({ filters: newFilters, cellClicked: cellClicked })
  },

  handleAddRow() {
    const newRow = {}
    let rows = this.data.rows
    let filteredRows = this.getRows()
    if (this.data.clickedCell) {
      let currentRow = filteredRows[this.data.clickedCell.row]
      let originalIdx = this.findRow(currentRow)
      rows.splice(originalIdx, 0, newRow)
    }
    this.update({ rows: rows })
  },

  handleDeleteRow() {
    let rows = this.data.rows
    let filteredRows = this.getRows()
    if (this.data.clickedCell) {
      let currentRow = filteredRows[this.data.clickedCell.row]
      let originalIdx = this.findRow(currentRow)
      rows.splice(originalIdx, 1)
      if (Object.keys(this.data.filters).length) {
        filteredRows.splice(this.data.clickedCell.row, 1)
      }
    }
    this.update({ rows: rows })
  },

  onClearFilters() {
    this.update({ filters: {} })
  },

  handlePaste(e) {
    if (this.data.editing && this.data.editable) {
      let separator = this.determineSeparator(name)
      let rowStart = this.data.clickedCell.row
      let columnStart = this.data.clickedCell.column
      const maxColumn = this.data.columns.length - 1

      const pastedText = e.clipboardData.getData('text')
      const rows = pastedText.split('\n')
      const matrix = []
      for (let row of rows) {
        const entries = row.split(separator)
        matrix.push(entries)
      }

      matrix.forEach((row, i) => {
        let rowNumber = i + rowStart
        row.forEach((value, j) => {
          let columnNumber = j + columnStart
          if (columnNumber <= maxColumn) {
            this.updateCoordinate(rowNumber, columnNumber, value)
          }
        })
      })
    }
  },

  onCellSelected(coordinates) {
    let clickedCell = {
      row: coordinates.rowIdx,
      column: coordinates.idx,
    }
    this.update({ clickedCell: clickedCell })
  },

  updateCoordinate(row, column, value) {
    let fromRow = row
    let toRow = row
    const key = this.data.columns[column].key
    const updated = { [key]: value }
    this.handleGridRowsUpdated({ fromRow, toRow, updated })
  },

  toggleFilter() {
    let toggleFilter = !this.data.toggleFilter
    this.update({ toggleFilter: toggleFilter })
  },

  constructFile(data, originalFile) {
    const columns = data.columns
    const rows = data.rows
    const name = originalFile.name
    const parentId = originalFile.info.parentId

    let separator = this.determineSeparator(name)
    if (rows && rows.length) {
      const columnKeys = []
      columns.forEach(column => {
        columnKeys.push(column.key)
      })
      const headerRow = columnKeys.join(separator).concat('\n')
      const body = rows
        .map(row => {
          let rowData = []
          columnKeys.forEach(columnKey => {
            rowData.push(row[columnKey])
          })
          return rowData.join(separator)
        })
        .join('\n')

      const text = headerRow.concat(body)

      // let file = {
      //   name: name,
      //   link: link,
      //   text: text,
      //   parentId: parentId
      // }

      let file = new File([text], name, { type: 'text/plain' })

      file.parentId = parentId
      return file
    }
    return
  },

  determineSeparator(fileName) {
    let separator
    if (files.hasExtension(name, ['.tsv'])) {
      separator = '\t'
    } else if (files.hasExtension(name, ['.csv'])) {
      separator = ','
    }
    return separator
  },

  saveFile() {
    let file = this.constructFile(this.data, this.data.originalFile)
    this.data.onSave(this.data.originalFile.info, file)
    this.update({ editing: false })
  },

  startEdit() {
    this.update({ editing: true, rows: this.data.originalData.slice(0) })
  },

  cancelEdit() {
    this.update({ rows: this.data.originalData.slice(0), editing: false })
  },
})

export default TableEditorStore

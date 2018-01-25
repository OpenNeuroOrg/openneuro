import React from 'react'
import Reflux from 'reflux'
import actions from './tableeditor.actions.js'
import ReactDataGrid from 'react-data-grid'
import TableEditorStore from './tableeditor.store.js'
import { refluxConnect } from '../../../utils/reflux'
const PropTypes = require('prop-types')
// next line is only required until ron-react-autocomplete is rebuilt and republished
require('react').PropTypes = PropTypes
require('react').createClass = require('create-react-class')
const { Data: { Selectors } } = require('react-data-grid-addons')

class NoToolbar extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.toggleFilter !== nextProps.toggleFilter) {
      this.props.onToggleFilter()
    }
  }
  render() {
    return <div />
  }
}

export default class TableEditor extends Reflux.Component {
  constructor(props) {
    super(props)
    refluxConnect(this, TableEditorStore, 'table')

    this.widgets = {
      add: this.addRowWidget.bind(this),
      delete: this.deleteRowWidget.bind(this),
      filter: this.filterWidget.bind(this),
      cancel: this.cancelWidget.bind(this),
      edit: this.editWidget.bind(this),
      save: this.saveWidget.bind(this),
    }

    this._dataGrid = this.dataGrid.bind(this)
    this._rowGetter = this.rowGetter.bind(this)
    this._getRows = this.getRows.bind(this)
    this._getSize = this.getSize.bind(this)
  }

  componentDidMount() {
    const columns = this.props.columns
    const originalData = this.props.data.slice(0)
    const rows = this.props.data.slice(0)
    let data = {
      rows: rows,
      originalData: originalData,
      columns: columns,
      filters: {},
      clickedCell: null,
      toggleFilter: false,
      editing: false,
      fileName: this.props.file.name,
      editable: !this.props.isSnapshot,
      ready: true,
      onSave: this.props.onSave,
      originalFile: this.props.file,
    }

    actions.setInitialState(data)
  }

  getRows() {
    let rows = Selectors.getRows(this.state.table)
    return rows
  }

  rowGetter(i) {
    return this._getRows()[i]
  }

  getSize() {
    let rows = this._getRows()
    if (rows && rows.length) {
      return rows.length
    } else {
      return 0
    }
  }

  addRowWidget() {
    if (this.state.table.editing && this.state.table.editable) {
      return (
        <span>
          <a title="add row" onClick={actions.handleAddRow}>
            <i className="fa fa-plus" />
            ADD ROW ABOVE
          </a>
        </span>
      )
    }
  }

  deleteRowWidget() {
    if (this.state.table.editing && this.state.table.editable) {
      return (
        <span>
          <a title="delete row" onClick={actions.handleDeleteRow}>
            <i className="fa fa-minus" />
            DELETE ROW
          </a>
        </span>
      )
    }
  }

  filterWidget() {
    return (
      <span>
        <a title="filter row" onClick={actions.toggleFilter}>
          <i className="fa fa-search" />
          FILTER ROWS
        </a>
      </span>
    )
  }

  cancelWidget() {
    if (this.state.table.editing && this.state.table.editable) {
      return (
        <span>
          <a title="cancel edit" onClick={actions.cancelEdit}>
            <i className="fa fa-times" />
            CANCEL EDIT
          </a>
        </span>
      )
    }
  }

  editWidget() {
    if (!this.state.table.editing && this.state.table.editable) {
      return (
        <span>
          <a title="edit table" onClick={actions.startEdit}>
            <i className="fa fa-pencil" />
            EDIT TABLE
          </a>
        </span>
      )
    }
  }

  saveWidget() {
    if (this.state.table.editing && this.state.table.editable) {
      return (
        <span>
          <a title="save" onClick={actions.saveFile}>
            <i className="fa fa-check" />
            SAVE CHANGES
          </a>
        </span>
      )
    }
  }

  dataGrid() {
    return (
      <div className="data-grid-controls">
        {this.widgets.filter()}
        {this.widgets.add()}
        {this.widgets.delete()}
        {this.widgets.cancel()}
        {this.widgets.edit()}
        {this.widgets.save()}
      </div>
    )
  }

  render() {
    if (this.state.table.ready) {
      return (
        <div onPaste={actions.handlePaste}>
          {this._dataGrid()}
          <ReactDataGrid
            enableCellSelect={this.state.table.editing}
            onGridSort={actions.handleGridSort}
            columns={this.state.table.columns}
            rowGetter={this._rowGetter}
            rowsCount={this._getSize()}
            onGridRowsUpdated={actions.handleGridRowsUpdated}
            toolbar={<NoToolbar toggleFilter={this.state.table.toggleFilter} />}
            onAddFilter={actions.handleFilterChange}
            onClearFilters={actions.onClearFilters}
            onCellCopyPaste={null}
            onCellSelected={actions.onCellSelected}
            minHeight={875}
          />
        </div>
      )
    } else {
      return <div />
    }
  }
}

// prop validation ----------------------------------------------------

TableEditor.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  toggleFilter: PropTypes.bool,
  fileName: PropTypes.string,
  isSnapshot: PropTypes.bool,
  originalFile: PropTypes.object,
}

NoToolbar.propTypes = {
  toggleFilter: PropTypes.bool,
  onToggleFilter: PropTypes.func,
}

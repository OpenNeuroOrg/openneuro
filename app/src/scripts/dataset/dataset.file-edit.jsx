/*eslint react/no-danger: 0 */

// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from '../utils/modal.jsx'
import files from '../utils/files'
import Papaya from '../common/partials/papaya.jsx'
import ReactTable from 'react-table'
import JsonEditor from './tools/json/jsoneditor.jsx'

export default class FileEdit extends React.Component {
  // life cycle events --------------------------------------------------

  render() {
    if (!this.props.show) {
      return false
    }
    let file = this.props.file

    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        className={'display-file-modal ' + this._extension(file.name)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {file.name.split('/')[file.name.split('/').length - 1]}
          </Modal.Title>
        </Modal.Header>
        <hr className="modal-inner" />
        <Modal.Body>{this._format(file)}</Modal.Body>
      </Modal>
    )
  }

  // template methods ---------------------------------------------------

  _format(file) {
    let name = file.name
    let content = file.text
    if (files.hasExtension(name, ['.json'])) {
      return (
        <div>
          <JsonEditor
            data={content}
            file={file}
            onSave={this.props.onSave.bind(file)}
            isSnapshot={this.props.isSnapshot}
            editing={true}
          />
        </div>
      )
    } else if (files.hasExtension(name, ['.tsv', '.csv'])) {
      let tableData = this._parseTabular(name, content)
      let data = tableData.data
      let columns = tableData.columns
      return (
        <div className="table-responsive">
          <ReactTable
            data={data}
            columns={columns}
            sortable={true}
            defaultPageSize={100}
            showPageSizeOptions={false}
            editing={true}
          />
        </div>
      )
    } else {
      return content
    }
  }

  // custom methods -----------------------------------------------------

  _htmlFormat(value) {
    return { __html: value }
  }

  _extension(name) {
    let nameParts = name.split('.')
    nameParts.shift()
    let ext = nameParts.join('-')
    return ext
  }

  /**
   * Parse Tabular
   *
   * Parse raw tabular data into an array of
   * objects readable by Reactable.
   */
  _parseTabular(name, data) {
    // determine separator
    let separator
    if (files.hasExtension(name, ['.tsv'])) {
      separator = '\t'
    } else if (files.hasExtension(name, ['.csv'])) {
      separator = ','
    }

    let tableData = { data: [], columns: [] }
    let rows = data.split('\n')
    let headers = rows[0].split(separator)

    //create columns from headers:
    for (let header of headers) {
      let headerObj = {
        Header: header,
        accessor: header,
      }
      tableData['columns'].push(headerObj)
    }
    // remove headers from rows
    rows.shift()

    // convert rows to object format
    for (let row of rows) {
      if (row && !/^\s*$/.test(row)) {
        row = row.split(separator)
        let rowObj = {}
        for (let i = 0; i < headers.length; i++) {
          rowObj[headers[i]] = row[i]
        }
        tableData['data'].push(rowObj)
      }
    }

    return tableData
  }
}

// prop validation ----------------------------------------------------

FileEdit.propTypes = {
  file: PropTypes.object,
  onHide: PropTypes.func,
  show: PropTypes.bool,
  onSave: PropTypes.func,
  isSnapshot: PropTypes.bool,
}

/*eslint react/no-danger: 0 */

// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from '../utils/modal.jsx'
import files from '../utils/files'
import Papaya from '../common/partials/papaya.jsx'
import TableEditor from './tools/table/tableeditor.js'

export default class FileDisplay extends React.Component {
  constructor(props) {
    super(props)
  }
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
            {this._download(file.link)}
          </Modal.Title>
        </Modal.Header>
        <hr className="modal-inner" />
        <Modal.Body>{this._format(file)}</Modal.Body>
      </Modal>
    )
  }

  // template methods ---------------------------------------------------

  _download(link) {
    if (link) {
      return (
        <div className="modal-download btn-admin-blue">
          <a href={link} download>
            <i className="fa fa-download" /> DOWNLOAD
          </a>
        </div>
      )
    }
  }

  _getTableComponent(file) {
    let name = file.name
    let content = file.text
    let tableData = this._parseTabular(name, content)
    let data = tableData.data
    let columns = tableData.columns
    return (
      <div>
        <TableEditor
          columns={columns}
          data={data}
          isSnapshot={this.props.isSnapshot}
          onSave={this.props.onSave.bind(file)}
          file={file}
        />
      </div>
    )
  }

  _format(file) {
    let name = file.name
    let content = file.text
    let link = file.link
    if (files.hasExtension(name, ['.json'])) {
      try {
        return JSON.stringify(JSON.parse(content), null, 4)
      } catch (e) {
        return content
      }
    } else if (files.hasExtension(name, ['.pdf'])) {
      return (
        <iframe
          src={'http://docs.google.com/gview?url=' + link + '&embedded=true'}
          className="file-view-iframe"
          frameBorder="0"
        />
      )
    } else if (files.hasExtension(name, ['.tsv', '.csv'])) {
      return this._getTableComponent(file)
    } else if (files.hasExtension(name, ['.nii.gz', '.nii'])) {
      return <Papaya image={link} />
    } else if (files.hasExtension(name, ['.jpg', '.jpeg', '.png', '.gif'])) {
      return (
        <div className="modal-preview-image">
          <img src={link} />
        </div>
      )
    } else if (files.hasExtension(name, ['.html'])) {
      return (
        <iframe
          src={link}
          className="file-view-iframe"
          frameBorder="0"
          sandbox="allow-scripts"
        />
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
    for (let header of headers) {
      let headerObj = {
        key: header,
        name: header,
        resizable: true,
        sortable: true,
        filterable: true,
        editable: true,
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

FileDisplay.propTypes = {
  file: PropTypes.object,
  onHide: PropTypes.func,
  onSave: PropTypes.func,
  show: PropTypes.bool,
  isSnapshot: PropTypes.bool,
}

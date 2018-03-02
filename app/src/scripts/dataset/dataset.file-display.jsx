/*eslint react/no-danger: 0 */

// dependencies -------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import PropTypes from 'prop-types'
import files from '../utils/files'
import Papaya from '../common/partials/papaya.jsx'
import ReactTable from 'react-table'
import datasetStore from './dataset.store'
import actions from './dataset.actions'
import JsonEditor from './tools/json/jsoneditor.jsx'
import Spinner from '../common/partials/spinner.jsx'
import Timeout from '../common/partials/timeout.jsx'
import ErrorBoundary from '../errors/errorBoundary.jsx'
import { withRouter } from 'react-router-dom'
import { refluxConnect } from '../utils/reflux'

class FileDisplay extends Reflux.Component {
  // life cycle events --------------------------------------------------
  constructor() {
    super()
    refluxConnect(this, datasetStore, 'datasets')
  }

  render() {
    let datasets = this.state.datasets

    const file = datasets ? datasets.displayFile : null
    const fileName = file ? file.name : null
    const fileLink = file ? file.link : null

    let loading = datasets && datasets.loading
    let loadingText =
      datasets && typeof datasets.loading == 'string'
        ? datasets.loading
        : 'loading'

    if (!file) {
      return null
    }

    let content = (
      <div className={'dataset-form display-file ' + this._extension(fileName)}>
        <div className="display-file-content">
          <div className="col-xs-12 dataset-form-header display-file-header">
            <div className="form-group modal-title">
              <label>
                {fileName.split('/')[fileName.split('/').length - 1]}
              </label>
              <div className="modal-download btn-admin-blue">
                {this._download(fileLink)}
              </div>
            </div>
            <hr className="modal-inner" />
          </div>
          <div className="dataset-form-body display-file-body col-xs-12">
            <div className="dataset-form-content col-xs-12">
              <div className="dataset file-display-modal">
                {this._format(file)}
              </div>
            </div>
          </div>
        </div>
      </div>
    )

    return (
      <ErrorBoundary
        message="The file has failed to load in time. Please check your network connection."
        className="col-xs-12 dataset-inner dataset-route dataset-wrap inner-route light text-center">
        {loading ? (
          <Timeout timeout={20000}>
            <Spinner active={true} text={loadingText} />
          </Timeout>
        ) : (
          content
        )}
      </ErrorBoundary>
    )
  }

  // template methods ---------------------------------------------------

  _download(link) {
    if (link) {
      return (
        <a href={link} download>
          <i className="fa fa-download" /> DOWNLOAD
        </a>
      )
    }
  }

  _format(file) {
    let name = file.name
    let link = file.link
    let content = file.text
    let isSnapshot = this.state.datasets ? this.state.datasets.snapshot : null
    if (files.hasExtension(name, ['.json'])) {
      return (
        <div>
          <JsonEditor
            data={content}
            file={file}
            onSave={actions.updateFile.bind(file)}
            isSnapshot={isSnapshot}
          />
        </div>
      )
    } else if (files.hasExtension(name, ['.pdf'])) {
      return (
        <iframe
          src={'http://docs.google.com/gview?url=' + link + '&embedded=true'}
          className="file-view-iframe"
          frameBorder="0"
        />
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
          />
        </div>
      )
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

FileDisplay.propTypes = {
  file: PropTypes.object,
  onHide: PropTypes.func,
  show: PropTypes.bool,
  onSave: PropTypes.func,
  isSnapshot: PropTypes.bool,
}

export default withRouter(FileDisplay)

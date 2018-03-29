/*eslint react/no-danger: 0 */

// dependencies -------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import PropTypes from 'prop-types'
import datasetStore from '../../dataset.store'
import actions from '../../dataset.actions'
import FileView from '../../../common/partials/file-view.jsx'
import { withRouter } from 'react-router-dom'
import { refluxConnect } from '../../../utils/reflux'

class LogsDisplay extends Reflux.Component {
  // life cycle events --------------------------------------------------
  constructor() {
    super()
    refluxConnect(this, datasetStore, 'datasets')
    this.state = {
      fileRequested: false,
    }
  }

  componentWillReceiveProps() {
    let datasets = this.state.datasets

    const file = datasets ? datasets.displayFile : null
    let fileName = file ? file.name : null

    if (!fileName) {
      // file path should be of form analysisbucket/datasethash/jobid/filename
      let filePath = decodeURIComponent(this.props.match.params.filePath)
      let snapshotId = datasets.selectedSnapshot
      let slugs = filePath.split('/')
      if (slugs.length > 3) {
        const jobId = slugs[2]
        const fileSlugs = slugs.slice(3)
        fileName = fileSlugs.join('/')
        if (
          fileName &&
          datasets &&
          datasets.dataset &&
          !this.state.fileRequested
        ) {
          this.setState({ fileRequested: true })
          let displayFile = {
            name: fileName,
            history: this.props.history,
            path: filePath,
          }
          actions.displayFile(snapshotId, jobId, displayFile, null)
        }
      }
    }
  }

  render() {
    return (
      <FileView
        datasets={this.state.datasets}
        updateFile={actions.updateFile.bind(this)}
      />
    )
  }
}

// prop validation ----------------------------------------------------

LogsDisplay.propTypes = {
  file: PropTypes.object,
  onHide: PropTypes.func,
  show: PropTypes.bool,
  onSave: PropTypes.func,
  isSnapshot: PropTypes.bool,
}

export default withRouter(LogsDisplay)

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
      let fileName = decodeURIComponent(this.props.match.params.filePath)
      if (
        fileName &&
        datasets &&
        datasets.dataset &&
        !this.state.fileRequested
      ) {
        this.setState({ fileRequested: true })
        actions.getLogstream(fileName, this.props.history, err => {
          if (err) throw new Error(err)
        })
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

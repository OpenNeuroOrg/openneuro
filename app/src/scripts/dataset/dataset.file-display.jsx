/*eslint react/no-danger: 0 */

// dependencies -------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import PropTypes from 'prop-types'
import datasetStore from './dataset.store'
import actions from './dataset.actions'
import FileView from '../common/partials/file-view.jsx'
import { Switch, Route, withRouter } from 'react-router-dom'
import { refluxConnect } from '../utils/reflux'

class FileDisplay extends React.Component {
  render() {
    return (
      <Switch>
        <Route
          name="dataset-file-display"
          path="/datasets/:datasetId/file-display/:fileName"
          exact
          component={FileContent}
        />
        <Route
          name="snapshot-file-display"
          path="/datasets/:datasetId/versions/:snapshotId/file-display/:fileName"
          exact
          component={FileContent}
        />
      </Switch>
    )
  }
}

class FileContent extends Reflux.Component {
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
    const fileName = file ? file.name : null

    if (!fileName) {
      let fileName = decodeURIComponent(this.props.match.params.fileName)
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
        }
        actions.displayFile(null, null, displayFile, null)
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

FileDisplay.propTypes = {
  file: PropTypes.object,
  onHide: PropTypes.func,
  show: PropTypes.bool,
  onSave: PropTypes.func,
  isSnapshot: PropTypes.bool,
}

FileContent.propTypes = {
  match: PropTypes.object,
}

export default withRouter(FileDisplay)

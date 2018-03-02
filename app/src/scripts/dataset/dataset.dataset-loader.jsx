import React from 'react'
import Reflux from 'reflux'
import { withRouter } from 'react-router-dom'
import datasetStore from './dataset.store'
import actions from './dataset.actions'
import bids from '../utils/bids'
import { refluxConnect } from '../utils/reflux'

class DatasetLoader extends Reflux.Component {
  constructor(props) {
    super(props)
    refluxConnect(this, datasetStore, 'datasets')
  }

  componentWillReceiveProps(nextProps) {
    this._loadData(nextProps)
  }

  componentDidMount() {
    this._loadData(this.props)
  }

  isSnapshot(props) {
    let pathname = props.location ? props.location.pathname : null
    if (pathname) {
      return pathname.indexOf('versions') !== -1
    } else {
      return false
    }
  }

  _loadData(props) {
    if (!this.isSnapshot(props)) {
      let reload = false
      let datasetId = props.match.params.datasetId
      if (datasetId && this.state.datasets) {
        const datasetUrl = bids.encodeId(datasetId)
        if (datasetUrl !== this.state.datasets.loadedUrl) {
          reload = true
        }
      }

      if (reload) {
        if (
          (datasetId && this.state.datasets && !this.state.datasets.dataset) ||
          (datasetId &&
            this.state.datasets &&
            this.state.datasets.dataset &&
            bids.encodeId(datasetId) !== this.state.datasets.dataset._id)
        ) {
          actions.loadDataset(bids.encodeId(datasetId))
        }
      }
    }
  }

  render() {
    return null
  }
}

export default withRouter(DatasetLoader)

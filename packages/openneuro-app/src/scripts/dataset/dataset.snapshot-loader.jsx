import Reflux from 'reflux'
import { withRouter } from 'react-router-dom'
import datasetStore from './dataset.store'
import bids from '../utils/bids'
import actions from './dataset.actions'
import { refluxConnect } from '../utils/reflux'

class SnapshotLoader extends Reflux.Component {
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
    if (this.isSnapshot(props)) {
      let reload = false
      let datasetId = props.match.params.datasetId
      const snapshotId = props.match.params.snapshotId
      if (snapshotId && this.state.datasets) {
        const datasetUrl = [datasetId, snapshotId].join(':')
        if (
          !this.state.datasets.loading &&
          datasetUrl !== this.state.datasets.loadedUrl
        ) {
          reload = true
        }
      }

      if (reload) {
        if (snapshotId) {
          const query = new URLSearchParams(props.location.search)
          const app = query.get('app')
          const version = query.get('version')
          const job = query.get('job')
          actions.trackView(bids.decodeId(datasetId), bids.decodeId(snapshotId))
          actions.loadDataset(datasetId, {
            snapshot: true,
            app: app,
            version: version,
            job: job,
            datasetId: datasetId,
            tag: snapshotId,
          })
        }
      }
    }
  }

  render() {
    return null
  }
}

export default withRouter(SnapshotLoader)

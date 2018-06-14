import Reflux from 'reflux'
import { withRouter } from 'react-router-dom'
import datasetStore from './dataset.store'
import actions from './dataset.actions'
import bids from '../utils/bids'
import { refluxConnect } from '../utils/reflux'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { datasets } from 'openneuro-client'

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
    this._subscribeToFileUpdates(this.props)
    this._subscribeToSnapshotCreation(this.props)
    this._subscribeToSnapshotDeletion(this.props)
  }

  _subscribeToFileUpdates(props) {
    props.getDataset.subscribeToMore({
      document: gql`
        subscription {
          draftFilesUpdated
        }
      `,
      updateQuery: () => {
        props.getDataset.refetch().then(() => {
          this._loadData(props, true)
        })
      },
    })
  }

  _subscribeToSnapshotCreation(props) {
    props.getDataset.subscribeToMore({
      document: gql`
        subscription {
          snapshotAdded
        }
      `,
      updateQuery: () => {
        props.getDataset.refetch().then(() => {
          this._loadData(props, true)
        })
      },
    })
  }

  _subscribeToSnapshotDeletion(props) {
    props.getDataset.subscribeToMore({
      document: gql`
        subscription {
          snapshotDeleted
        }
      `,
      updateQuery: () => {
        props.getDataset.refetch().then(() => {
          props.history.push(
            '/datasets/' + bids.decodeId(this.state.datasets._id),
          )
        })
      },
    })
  }

  isSnapshot(props) {
    let pathname = props.location ? props.location.pathname : null
    if (pathname) {
      return pathname.indexOf('versions') !== -1
    } else {
      return false
    }
  }

  _loadData(props, forceRefresh) {
    if (!this.isSnapshot(props)) {
      let reload = false
      let datasetId = props.match.params.datasetId
      if (datasetId && this.state.datasets) {
        const datasetUrl = bids.encodeId(datasetId)
        const needsRefresh =
          datasetUrl !== this.state.datasets.loadedUrl &&
          !this.state.datasets.loading
        const refresh = needsRefresh || forceRefresh
        if (refresh) {
          reload = true
        }
      }

      if (reload) {
        if (datasetId) {
          actions.loadDataset(bids.encodeId(datasetId))
        }
      }
    }
  }

  render() {
    return null
  }
}

export default graphql(datasets.getDataset, {
  name: 'getDataset',
  options: props => ({
    variables: {
      id: bids.decodeId(props.match.params.datasetId),
    },
  }),
})(withRouter(DatasetLoader))

import React from 'react'
import Reflux from 'reflux'
import { withRouter, Redirect } from 'react-router-dom'
import datasetStore from './dataset.store'
import actions from './dataset.actions'
import bids from '../utils/bids'
import { refluxConnect } from '../utils/reflux'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { datasets } from 'openneuro-client'
import LoggedOut from '../authentication/logged-out.jsx'

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
    this._subscribeToPermissionsUpdates(this.props)
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

  _subscribeToPermissionsUpdates(props) {
    props.getDataset.subscribeToMore({
      document: gql`
        subscription {
          permissionsUpdated
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
            '/datasets/' + bids.decodeId(this.state.datasets.dataset._id),
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
    // Restore redirect functionality if anonymous users end up on a draft page
    if (
      !this.state.datasets.loading &&
      this.state.datasets.snapshots.length > 0 &&
      this.props.location.pathname.indexOf('versions') === -1
    ) {
      // Copy array to avoid messing with the store
      const snapshots = this.state.datasets.snapshots.slice()
      // Sort by creation time
      snapshots.sort((a, b) => {
        return new Date(b.created) - new Date(a.created)
      })
      const newestSnapshot = snapshots[0].tag
      // Trim trailing slash if needed
      const currentPath = this.props.location.pathname.replace(/\/$/, '')
      const newestSnapshotUrl = `${currentPath}/versions/${newestSnapshot}`
      return (
        <LoggedOut>
          <Redirect to={newestSnapshotUrl} />
        </LoggedOut>
      )
    } else {
      return null
    }
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

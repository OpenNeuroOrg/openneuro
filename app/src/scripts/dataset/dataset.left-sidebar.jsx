import React from 'react'
import Reflux from 'reflux'
import { Link } from 'react-router-dom'
import moment from 'moment'
import bids from '../utils/bids'
import userStore from '../user/user.store.js'
import datasetStore from './dataset.store'
import actions from './dataset.actions.js'
import { refluxConnect } from '../utils/reflux'

export class LeftSidebar extends Reflux.Component {
  constructor(props) {
    super(props)
    refluxConnect(this, datasetStore, 'datasets')
  }

  render() {
    let snapshots = this.state.datasets.snapshots
    let isSignedIn = !!userStore.hasToken()
    let snapshotOptions = snapshots.map(snapshot => {
      if (snapshot.orphaned) {
        return (
          <li key="orphaned">
            <a disabled>
              <div className="clearfix">
                <div className=" col-xs-12">
                  <span className="dataset-type text-danger">
                    Draft dataset has been deleted.
                  </span>
                  <span className="icons text-danger">
                    <span className="published">
                      <i className="fa fa-exclamation-circle" />
                    </span>
                  </span>
                </div>
              </div>
            </a>
          </li>
        )
      }

      let analysisCount
      if (!snapshot.isOriginal && snapshot.analysisCount > 0) {
        analysisCount = (
          <span className="job-count">
            <i className="fa fa-area-chart" />
            <span className="count">{snapshot.analysisCount}</span>
          </span>
        )
      } else if (snapshot.isOriginal && this.state.datasets.uploading) {
        analysisCount = (
          <span className="job-count">
            <span className="warning-loading">
              <i className="fa fa-spin fa-circle-o-notch" />
            </span>
          </span>
        )
      }

      const datasetId = bids.decodeId(
        snapshot.original ? snapshot.original : snapshot._id,
      )
      const urlBase = '/datasets/' + datasetId
      const snapshotUrl = snapshot.original
        ? urlBase + '/versions/' + bids.decodeId(snapshot._id)
        : urlBase

      return (
        <li key={snapshot._id}>
          <Link
            to={snapshotUrl}
            className={
              this.state.datasets.selectedSnapshot == snapshot._id
                ? 'active'
                : null
            }>
            <div className="clearfix">
              <div className=" col-xs-12">
                <span className="dataset-type">
                  {snapshot.isOriginal
                    ? 'Draft'
                    : 'v' + snapshot.snapshot_version}
                </span>
                <span className="date-modified">
                  {snapshot.modified
                    ? moment(snapshot.modified).format('ll')
                    : null}
                </span>
                <span className="icons">
                  {snapshot.public && isSignedIn ? (
                    <span className="published">
                      <i className="fa fa-globe" />
                    </span>
                  ) : null}
                  {analysisCount}
                </span>
              </div>
            </div>
          </Link>
        </li>
      )
    })

    return (
      <div className="left-sidebar">
        <span className="slide">
          <div role="presentation" className="snapshot-select">
            <span>
              <h3>Versions</h3>
              <ul>{snapshotOptions}</ul>
            </span>
          </div>
        </span>
      </div>
    )
  }
}

export class LeftSidebarButton extends Reflux.Component {
  constructor() {
    super()
    refluxConnect(this, datasetStore, 'datasets')
  }

  render() {
    let showSidebar = this.state.datasets.showSidebar
    return (
      <span className="show-nav-btn" onClick={actions.toggleSidebar}>
        {showSidebar ? (
          <i className="fa fa-angle-double-left" aria-hidden="true" />
        ) : (
          <i className="fa fa-angle-double-right" aria-hidden="true" />
        )}
      </span>
    )
  }
}

import React from 'react'
import Reflux from 'reflux'
import PropTypes from 'prop-types'
import { LeftSidebar, LeftSidebarButton } from './dataset.left-sidebar.jsx'
import Tools from './tools'
import ErrorBoundary from '../errors/errorBoundary.jsx'
import Spinner from '../common/partials/spinner.jsx'
import Timeout from '../common/partials/timeout.jsx'
import datasetStore from './dataset.store.js'
import actions from './dataset.actions'
import bids from '../utils/bids'
import DatasetRoutes from './dataset.routes.jsx'
import Helmet from 'react-helmet'
import { withRouter } from 'react-router-dom'
import { refluxConnect } from '../utils/reflux'
import { pageTitle } from '../resources/strings'

// let uploadWarning = 'You are currently uploading files. Leaving this page will cancel the upload process.'

class Dataset extends Reflux.Component {
  constructor(props) {
    super(props)
    refluxConnect(this, datasetStore, 'datasets')
  }

  // life cycle events --------------------------------------------------

  render() {
    let showSidebar = this.state.datasets.showSidebar
    let dataset = this.state.datasets.dataset
    let datasetLabel = dataset ? dataset.label : ''
    const description = dataset
      ? dataset.README ? dataset.README : dataset.label
      : null
    return (
      <div className="page dataset">
        <div
          className={
            showSidebar ? 'open dataset-container' : 'dataset-container'
          }>
          <LeftSidebar />
          <LeftSidebarButton />
          <Tools />
          <Helmet>
            <title>
              {pageTitle} - {datasetLabel}
            </title>
            <meta name="description" content={description} />
          </Helmet>
          <div className="dataset-annimation">
            <div className="clearfix">
              <div className="col-xs-12 dataset-inner">{DatasetRoutes()}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Dataset.propTypes = {}

export default withRouter(Dataset)

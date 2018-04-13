import React from 'react'
import Reflux from 'reflux'
import { LeftSidebar, LeftSidebarButton } from './dataset.left-sidebar.jsx'
import Tools from './tools'
import UpdateWarn from './dataset.update-warning.jsx'
import datasetStore from './dataset.store.js'
import DatasetRoutes from './dataset.routes.jsx'
import Helmet from 'react-helmet'
import { withRouter } from 'react-router-dom'
import { refluxConnect } from '../utils/reflux'
import { pageTitle } from '../resources/strings'
import schemaGenerator from '../utils/json-ld.js'
import notifications from '../notification/notification.actions'

// let uploadWarning = 'You are currently uploading files. Leaving this page will cancel the upload process.'

class Dataset extends Reflux.Component {
  constructor(props) {
    super(props)
    refluxConnect(this, datasetStore, 'datasets')
  }

  // life cycle events --------------------------------------------------
  componentWillUnmount() {
    // Clears the active alert for a dataset
    notifications.closeAlert()
  }

  render() {
    let datasets = this.state.datasets
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
          <Helmet>
            <title>
              {pageTitle} - {datasetLabel}
            </title>
            <meta name="description" content={description} />
            <script type="application/ld+json">
              {schemaGenerator(datasets)}
            </script>
          </Helmet>
          <LeftSidebar />
          <LeftSidebarButton />
          <UpdateWarn
            show={this.state.datasets.modals.update}
            update={this.state.datasets.currentUpdate}
          />
          <Tools />

          <div className="fade-in inner-route dataset-route light">
            <div className="clearfix dataset-wrap">
              <div className="dataset-annimation">
                <div className="col-xs-12 dataset-inner">
                  <DatasetRoutes />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Dataset)

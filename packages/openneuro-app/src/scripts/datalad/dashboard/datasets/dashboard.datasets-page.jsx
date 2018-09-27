import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { PanelGroup, Panel } from 'react-bootstrap'
import Helmet from 'react-helmet'
import Statuses from '../../../dataset/dataset.statuses.jsx'
import Metrics from '../../../dataset/dataset.metrics.jsx'
import Uploaded from './uploaded.jsx'
// filter
// sort
import Summary from '../../fragments/dataset-summary.jsx'
import Search from '../../../common/partials/search.jsx'

import { pageTitle } from '../../../resources/strings'

export default class DashboardDatasetsPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: null,
      title: 'All Datasets',
    }
  }

  datasetPanels() {
    const datasetComponents = this.props.datasets.map(dataset => {
      return (
        <div className="fade-in  panel panel-default" key={dataset._id}>
          <div className="panel-heading">
            <div className="header clearfix">
              <Link to={'/datasets/' + dataset.id}>
                <h4 className="dataset-name">{dataset.id}</h4>
                <Uploaded
                  uploader={dataset.uploader}
                  created={dataset.created}
                />
              </Link>
              <div className="metric-container">
                <Metrics dataset={dataset} fromDashboard />
              </div>
              <div className="status-container">
                <Statuses dataset={dataset} minimal={true} />
              </div>
            </div>
            <Summary summary={dataset.draft.summary} minimal={true} />
          </div>
        </div>
      )
    })
    return (
      <PanelGroup>
        <Panel>{datasetComponents}</Panel>
      </PanelGroup>
    )
  }

  render() {
    return (
      <div>
        <div className="dashboard-dataset-teasers datasets datasets-private">
          <div className="header-filter-sort clearfix">
            <Helmet>
              <title>
                {pageTitle} - {this.state.title}
              </title>
            </Helmet>
            <div className="admin header-wrap clearfix">
              <div className="row">
                <div className="col-md-5">
                  <h2>{this.state.title}</h2>
                </div>
                <div className="col-md-7">
                  <Search />
                </div>
              </div>
            </div>
            <div className="filters-sort-wrap clearfix" />
            {this.datasetPanels()}
          </div>
        </div>
      </div>
    )
  }
}

DashboardDatasetsPage.propTypes = {
  datasets: PropTypes.array,
}

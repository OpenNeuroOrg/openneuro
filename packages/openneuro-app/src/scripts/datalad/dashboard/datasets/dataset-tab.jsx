import React from 'react'
import PropTypes from 'prop-types'
import { PanelGroup, Panel } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { pageTitle } from '../../../resources/strings'
import Search from '../../../common/partials/search.jsx'
import DatasetRow from './dataset-row.jsx'

const DatasetPanels = ({ datasets }) => (
  <PanelGroup>
    <Panel>
      {datasets.map(dataset => (
        <DatasetRow dataset={dataset} key={dataset.id} />
      ))}
    </Panel>
  </PanelGroup>
)

DatasetPanels.propTypes = {
  datasets: PropTypes.array,
}

const DatasetTab = ({ datasets, title }) => (
  <div>
    <div className="dashboard-dataset-teasers datasets datasets-private">
      <div className="header-filter-sort clearfix">
        <Helmet>
          <title>
            {pageTitle} - {title}
          </title>
        </Helmet>
        <div className="admin header-wrap clearfix">
          <div className="row">
            <div className="col-md-5">
              <h2>{title}</h2>
            </div>
            <div className="col-md-7">
              <Search />
            </div>
          </div>
        </div>
        <div className="filters-sort-wrap clearfix" />
        <DatasetPanels datasets={datasets} />
      </div>
    </div>
  </div>
)

DatasetTab.propTypes = {
  title: PropTypes.string,
  datasets: PropTypes.array,
}

export default DatasetTab

import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { pageTitle } from '../../../resources/strings'
import Search from '../../../common/partials/search.jsx'
import DatasetVirtualScroller from './dataset-virtual-scroller.jsx'

const DatasetTab = ({ datasets, title, pageInfo, loadMoreRows }) => (
  <div className="dashboard-dataset-teasers datasets datasets-private">
    <Helmet>
      <title>
        {pageTitle} - {title}
      </title>
    </Helmet>
    <div className="header-filter-sort clearfix">
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
      <DatasetVirtualScroller
        datasets={datasets}
        pageInfo={pageInfo}
        loadMoreRows={loadMoreRows}
      />
    </div>
  </div>
)

DatasetTab.propTypes = {
  title: PropTypes.string,
  datasets: PropTypes.array,
  pageInfo: PropTypes.object,
  loadMoreRows: PropTypes.func,
}

export default DatasetTab

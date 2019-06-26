import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { pageTitle } from '../../../resources/strings'
import Spinner from '../../../common/partials/spinner.jsx'
import Search from '../../../common/partials/search.jsx'
import DatasetVirtualScroller from './dataset-virtual-scroller.jsx'
import DatasetSorter from './dataset-sorter.jsx'
import DatasetFilter from './dataset-filter.jsx'
import ErrorBoundary from '../../../errors/errorBoundary.jsx'
import styled from '@emotion/styled'

const FullHeightFlexDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 1 auto;
`

const title = isPublic => (isPublic ? 'Public Datasets' : 'My Datasets')

const DatasetTabLoaded = ({ data, loadMoreRows, publicDashboard }) => {
  if (
    data &&
    data.datasets &&
    data.datasets.edges &&
    data.datasets.edges.length
  ) {
    return (
      <DatasetVirtualScroller
        datasets={data.datasets.edges}
        pageInfo={data.datasets.pageInfo}
        loadMoreRows={loadMoreRows}
        publicDashboard={publicDashboard}
      />
    )
  } else {
    return (
      <div className="panel panel-heading text-center">
        <h4>Zero datasets found</h4>
        No datasets match your current filters.
      </div>
    )
  }
}

const DatasetTab = ({
  data,
  loadMoreRows,
  refetch,
  queryVariables,
  loading,
  publicDashboard,
  error,
}) => (
  <FullHeightFlexDiv className="dashboard-dataset-teasers datasets datasets-private">
    <Helmet>
      <title>
        {pageTitle} - {title(publicDashboard)}
      </title>
    </Helmet>
    <div className="header-filter-sort clearfix">
      <div className="admin header-wrap clearfix">
        <div className="row">
          <div className="col-md-5">
            <h2>{title(publicDashboard)}</h2>
          </div>
          <div className="col-md-7">
            <Search />
          </div>
        </div>
      </div>
      <div className="filters-sort-wrap clearfix">
        <div className="sort clearfix">
          <label>Sort by:</label>
          <DatasetSorter refetch={refetch} queryVariables={queryVariables} />
        </div>
        {publicDashboard ? null : (
          <div className="filters">
            <label>Filter by:</label>
            <DatasetFilter refetch={refetch} queryVariables={queryVariables} />
          </div>
        )}
      </div>
    </div>
    {loading ? (
      <Spinner text="Loading Datasets" active />
    ) : (
      <ErrorBoundary error={error} subject={'error in dashboard dataset tab'}>
        <DatasetTabLoaded
          data={data}
          loadMoreRows={loadMoreRows}
          publicDashboard={publicDashboard}
        />
      </ErrorBoundary>
    )}
  </FullHeightFlexDiv>
)

DatasetTab.propTypes = {
  data: PropTypes.object,
  loadMoreRows: PropTypes.func,
  refetch: PropTypes.func,
  queryVariables: PropTypes.object,
  loading: PropTypes.bool,
  publicDashboard: PropTypes.bool,
}

export default DatasetTab

import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { pageTitle } from '../../../resources/strings'
import Spinner from '../../../common/partials/spinner.jsx'
import Search from '../../../common/partials/search.jsx'
import DatasetVirtualScroller from './dataset-virtual-scroller.jsx'
import DatasetSorter from './dataset-sorter.jsx'
import DatasetFilter from './dataset-filter.jsx'
import DatasetDeletedSubscription from '../../subscriptions/dataset-deleted-subscription.jsx'
import ErrorBoundary from '../../../errors/errorBoundary.jsx'
import styled from '@emotion/styled'

const FullHeightFlexDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 1 auto;
`

const MobileLabel = styled.label`
  text-transform: uppercase;
  font-size: 10px;
  font-weight: 600;
  color: #777;
  margin: 10px 10px 7px 10px;
`

const title = (isPublic, isSaved) =>
  isPublic
    ? 'Public Dataset Results'
    : isSaved
    ? 'Saved Datasets'
    : 'My Datasets'

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

const extractIds = data =>
  data && data.datasets ? data.datasets.edges.map(d => d.node.id) : []

const DatasetTab = ({
  data,
  loadMoreRows,
  refetch,
  queryVariables,
  loading,
  publicDashboard,
  savedDashboard,
  error,
  isMobile,
}) => (
  <FullHeightFlexDiv className="dashboard-dataset-teasers datasets datasets-private">
    <Helmet>
      <title>
        {title(publicDashboard, savedDashboard)} - {pageTitle}
      </title>
    </Helmet>
    <div className="header-filter-sort clearfix">
      <div className="admin header-wrap clearfix">
        <div className="row">
          {isMobile && (
            <div className="col-md-7">
              <Search />
            </div>
          )}
          <div className="col-md-5">
            <h2>{title(publicDashboard, savedDashboard)}</h2>
            {isMobile && !loading && (
              <h6>
                {data.datasets
                  ? `Results ${data.datasets.pageInfo.count}`
                  : 'Zero results'}{' '}
              </h6>
            )}
          </div>
          {!isMobile && (
            <div className="col-md-7">
              <Search />
            </div>
          )}
        </div>
      </div>
      <div className={isMobile ? '' : 'filters-sort-wrap clearfix'}>
        <div className={isMobile ? '' : 'sort clearfix'}>
          {!isMobile && <label>Sort by:</label>}
          <DatasetSorter refetch={refetch} queryVariables={queryVariables} />
        </div>
        {publicDashboard || savedDashboard ? null : (
          <div className="filters">
            {isMobile ? (
              <MobileLabel>Filter by:</MobileLabel>
            ) : (
              <label>Filter by:</label>
            )}
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
        <DatasetDeletedSubscription
          datasetIds={extractIds(data)}
          onDeleted={window.location.reload.bind(window.location)}
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
  savedDashboard: PropTypes.bool,
  error: PropTypes.object,
  isMobile: PropTypes.bool,
}

export default DatasetTab

import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { pageTitle } from '../../../resources/strings'
import Spinner from '../../../common/partials/spinner.jsx'
import Search from '../../../common/partials/search.jsx'
import DatasetVirtualScroller from './dataset-virtual-scroller.jsx'
import DatasetSorter from './dataset-sorter.jsx'
import styled from '@emotion/styled'

const FullHeightFlexDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 1 auto;
`

const title = isPublic => (isPublic ? 'Public Datasets' : 'My Datasets')

const DatasetTab = ({
  data,
  loadMoreRows,
  refetch,
  queryVariables,
  loading,
}) => (
  <FullHeightFlexDiv className="dashboard-dataset-teasers datasets datasets-private">
    <Helmet>
      <title>
        {pageTitle} - {title(queryVariables.public)}
      </title>
    </Helmet>
    <div className="header-filter-sort clearfix">
      <div className="admin header-wrap clearfix">
        <div className="row">
          <div className="col-md-5">
            <h2>{title(queryVariables.public)}</h2>
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
      </div>
    </div>
    {loading ? (
      <Spinner text="Loading Datasets" active />
    ) : (
      <DatasetVirtualScroller
        datasets={data.datasets.edges}
        pageInfo={data.datasets.pageInfo}
        loadMoreRows={loadMoreRows}
      />
    )}
  </FullHeightFlexDiv>
)

DatasetTab.propTypes = {
  data: PropTypes.object,
  loadMoreRows: PropTypes.func,
  refetch: PropTypes.func,
  queryVariables: PropTypes.object,
  loading: PropTypes.bool,
}

export default DatasetTab

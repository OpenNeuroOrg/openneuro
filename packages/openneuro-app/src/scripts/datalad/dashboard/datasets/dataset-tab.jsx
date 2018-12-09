import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { pageTitle } from '../../../resources/strings'
import Search from '../../../common/partials/search.jsx'
import DatasetVirtualScroller from './dataset-virtual-scroller.jsx'
import styled from 'styled-components'

const sortFields = [
  'created',
  'name',
  'uploader',
  'stars',
  'downloads',
  'subscriptions',
]

const Capitalized = styled.span`
  text-transform: capitalize;
`

const FullHeightFlexDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
`

const SortField = ({ field, queryVariables, refetch }) => {
  const fieldValue =
    field in queryVariables.orderBy && queryVariables.orderBy[field]
  let icon
  if (fieldValue) {
    if (fieldValue === 'ascending') {
      icon = <i className="fa fa-sort-asc" />
    } else {
      icon = <i className="fa fa-sort-desc" />
    }
  }
  const sortBy = () => {
    const newQueryVariables = { ...queryVariables }
    newQueryVariables.orderBy[field] =
      queryVariables.orderBy[field] === 'descending'
        ? 'ascending'
        : 'descending'
    refetch(queryVariables)
  }
  return (
    <a
      key={field}
      className={fieldValue ? 'btn-sort name active' : 'btn-sort name'}
      onClick={sortBy}>
      <Capitalized>{field}</Capitalized> {icon}
    </a>
  )
}

const DatasetSorter = ({ refetch, queryVariables }) => (
  <>
    {sortFields.map(field => (
      <SortField
        field={field}
        queryVariables={queryVariables}
        refetch={refetch}
        key={field}
      />
    ))}
  </>
)

const DatasetTab = ({
  datasets,
  title,
  pageInfo,
  loadMoreRows,
  refetch,
  queryVariables,
}) => (
  <FullHeightFlexDiv className="dashboard-dataset-teasers datasets datasets-private">
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
      <div className="filters-sort-wrap clearfix">
        <div className="sort clearfix">
          <label>Sort by:</label>
          <DatasetSorter refetch={refetch} queryVariables={queryVariables} />
        </div>
      </div>
    </div>
    <DatasetVirtualScroller
      datasets={datasets}
      pageInfo={pageInfo}
      loadMoreRows={loadMoreRows}
    />
  </FullHeightFlexDiv>
)

DatasetTab.propTypes = {
  title: PropTypes.string,
  datasets: PropTypes.array,
  pageInfo: PropTypes.object,
  loadMoreRows: PropTypes.func,
  refetch: PropTypes.func,
  queryVariables: PropTypes.object,
}

export default DatasetTab

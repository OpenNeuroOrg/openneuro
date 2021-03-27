import { captureException } from '@sentry/browser'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { pageTitle } from '../../../resources/strings'
import Spinner from '../../../common/partials/spinner.jsx'
import SearchInput from '../../../search/search-input'
import DatasetVirtualScroller from './dataset-virtual-scroller.jsx'
import DatasetSorter from './dataset-sorter.jsx'
import DatasetFilter from './dataset-filter.jsx'
import ErrorBoundary from '../../../errors/errorBoundary.jsx'
import styled from '@emotion/styled'
import { Media } from '../../../styles/media'

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

const DatasetTabLoaded = ({ datasets, loadMoreRows, publicDashboard }) => {
  if (datasets && datasets.edges && datasets.edges.length) {
    return (
      <DatasetVirtualScroller
        datasets={datasets.edges}
        pageInfo={datasets.pageInfo}
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

const DatasetTabSortWrap = ({ children }) => (
  <>
    <Media at="small">
      <div>{children}</div>
    </Media>
    <Media greaterThan="medium">
      <div className="filters-sort-wrap clearfix"></div>
    </Media>
  </>
)

DatasetTabSortWrap.propTypes = {
  children: PropTypes.element.isRequired,
}

const DatasetTabSortClearfix = ({ children }) => (
  <>
    <Media at="small">
      <div>{children}</div>
    </Media>
    <Media greaterThan="medium">
      <div className="sort clearfix">{children}</div>
    </Media>
  </>
)

DatasetTabSortClearfix.propTypes = {
  children: PropTypes.element.isRequired,
}

const DatasetTab = ({
  data,
  loadMoreRows,
  refetch,
  queryVariables,
  loading,
  error,
  publicDashboard,
  savedDashboard,
}) => {
  useEffect(() => {
    if (error) {
      if (data.datasets) {
        // show datasets
        captureException(error)
      } else {
        // direct to freshdesk
        throw error
      }
    }
  }, [error, data.datasets])
  return (
    <FullHeightFlexDiv className="dashboard-dataset-teasers datasets datasets-private">
      <Helmet>
        <title>
          {title(publicDashboard, savedDashboard)} - {pageTitle}
        </title>
      </Helmet>
      <div className="header-filter-sort clearfix">
        <div className="admin header-wrap clearfix">
          <div className="row">
            <Media at="small">
              <div className="col-md-7">
                <SearchInput />
              </div>
            </Media>
            <div className="col-md-5">
              <h2>{title(publicDashboard, savedDashboard)}</h2>
              <Media at="small">
                {!loading && (
                  <h6>
                    {data.datasets
                      ? `Results ${data.datasets.pageInfo.count}`
                      : 'Zero results'}{' '}
                  </h6>
                )}
              </Media>
            </div>
            <Media greaterThan="medium">
              <div className="col-md-7">
                <SearchInput />
              </div>
            </Media>
          </div>
        </div>
        <DatasetTabSortWrap>
          <DatasetTabSortClearfix>
            <Media greaterThan="medium">
              <label>Sort by:</label>
            </Media>
            <DatasetSorter refetch={refetch} queryVariables={queryVariables} />
          </DatasetTabSortClearfix>
          {publicDashboard || savedDashboard ? null : (
            <div className="filters">
              <Media at="small">
                <MobileLabel>Filter by:</MobileLabel>
              </Media>
              <Media greaterThan="medium">
                <label>Filter by:</label>
              </Media>
              <DatasetFilter
                refetch={refetch}
                queryVariables={queryVariables}
              />
            </div>
          )}
        </DatasetTabSortWrap>
      </div>
      {loading ? (
        <Spinner text="Loading Datasets" active />
      ) : (
        <ErrorBoundary subject={'error in dashboard dataset tab'}>
          <DatasetTabLoaded
            datasets={data.datasets}
            loadMoreRows={loadMoreRows}
            publicDashboard={publicDashboard}
          />
        </ErrorBoundary>
      )}
    </FullHeightFlexDiv>
  )
}

DatasetTab.propTypes = {
  data: PropTypes.object,
  loadMoreRows: PropTypes.func,
  refetch: PropTypes.func,
  queryVariables: PropTypes.object,
  loading: PropTypes.bool,
  publicDashboard: PropTypes.bool,
  savedDashboard: PropTypes.bool,
  error: PropTypes.object,
}

export default DatasetTab

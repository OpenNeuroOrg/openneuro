// dependencies -------------------------------------------------------

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import Helmet from 'react-helmet'
import Spinner from '../common/partials/spinner.jsx'
import { Link } from 'react-router-dom'
import { pageTitle } from '../resources/strings.js'
import { unescapePath } from '../file-tree/file-tree.jsx'

export const FLAGGED_FILES = gql`
  query flaggedFiles($flagged: Boolean, $deleted: Boolean) {
    flaggedFiles(flagged: $flagged, deleted: $deleted) {
      datasetId
      snapshot
      filepath
      flagger {
        name
        email
      }
    }
  }
`

const FlaggedFilesContainer = () => {
  const [includeFlagged, setIncludeFlagged] = useState(true)
  const [includeDeleted, setIncludeDeleted] = useState(false)
  const { data, loading, error } = useQuery(FLAGGED_FILES, {
    variables: { flagged: includeFlagged, deleted: includeDeleted },
    errorPolicy: 'all',
  })
  return (
    <FlaggedFiles
      {...{
        includeFlagged,
        setIncludeFlagged,
        includeDeleted,
        setIncludeDeleted,
        loading,
        data,
      }}
    />
  )
}

const FlaggedFiles = ({
  includeFlagged,
  setIncludeFlagged,
  includeDeleted,
  setIncludeDeleted,
  loading,
  data,
}) => (
  <>
    <Helmet>
      <title>Admin Dashboard - {pageTitle}</title>
    </Helmet>
    <div className="dashboard-dataset-teasers fade-in admin-users clearfix">
      <div className="header-wrap clearfix">
        <div className="col-sm-12">
          <h2>Flagged Annexed Files</h2>
        </div>
      </div>

      <div className="filters-sort-wrap clearfix">
        <span>
          <div className="filters">
            <label>Filter By:</label>
            <button
              className={includeFlagged ? 'active' : null}
              onClick={() => setIncludeFlagged(prev => !prev)}>
              <span className="filter-flagged">
                <i
                  className={
                    includeFlagged ? 'fa fa-check-square-o' : 'fa fa-square-o'
                  }
                />{' '}
                Flagged
              </span>
            </button>
            <button
              className={includeDeleted ? 'active' : null}
              onClick={() => setIncludeDeleted(prev => !prev)}>
              <span className="filter-deleted">
                <i
                  className={
                    includeDeleted ? 'fa fa-check-square-o' : 'fa fa-square-o'
                  }
                />{' '}
                Deleted
              </span>
            </button>
          </div>
        </span>
      </div>

      <div>
        <div className="col-xs-12 users-panel-wrap">
          <div className="fade-in user-panel-header clearfix">
            <div className="col-xs-2 user-col">
              <label>Dataset : Snapshot</label>
            </div>
            <div className="col-xs-7 user-col">
              <label>File</label>
            </div>
            <div className="col-xs-3 user-col">
              <label>Flagged By</label>
            </div>
          </div>
          {loading && <Spinner active message="Loading..." />}
          {data &&
            (data.flaggedFiles.length ? (
              data.flaggedFiles.map((flaggedFile, key) => (
                <FlaggedItem {...flaggedFile} key={key} />
              ))
            ) : (
              <h4>No Results Found</h4>
            ))}
        </div>
      </div>
    </div>
  </>
)

FlaggedFiles.propTypes = {
  includeFlagged: PropTypes.bool,
  setIncludeFlagged: PropTypes.func,
  includeDeleted: PropTypes.bool,
  setIncludeDeleted: PropTypes.func,
  loading: PropTypes.bool,
  data: PropTypes.object,
}

const datasetUrlPath = (datasetId, snapshot) =>
  `/datasets/${datasetId}${snapshot === 'HEAD' ? '' : `/versions/${snapshot}`}`

const FlaggedItem = ({
  datasetId,
  snapshot,
  filepath,
  flagger: { name, email },
}) => {
  return (
    <div className="fade-in user-panel clearfix panel panel-default">
      <div className="col-xs-2 user-col">
        <h3>
          <Link to={datasetUrlPath(datasetId, snapshot)}>
            <i className="fa fa-link" aria-hidden="true" /> {datasetId}
            {' : '}
            {snapshot}
          </Link>
        </h3>
      </div>
      <div className="col-xs-7 user-col middle">
        <h3>
          <div className="filepath">
            <span>{unescapePath(filepath)}</span>
          </div>
        </h3>
      </div>
      <div className="col-xs-3 user-col middle">
        <h3 className="user-name">{name}</h3>
        <h3 className="user-email">{email}</h3>
      </div>
    </div>
  )
}

FlaggedItem.propTypes = {
  datasetId: PropTypes.string,
  snapshot: PropTypes.string,
  filepath: PropTypes.string,
  flagger: PropTypes.object,
}

export default FlaggedFilesContainer

// dependencies -------------------------------------------------------
import * as Sentry from "@sentry/react"
import React, { useState } from "react"
import PropTypes from "prop-types"
import { useQuery } from "@apollo/client"
import { gql } from "@apollo/client"
import Helmet from "react-helmet"
import { Loading } from "../../components/loading/Loading"
import { Link } from "react-router-dom"
import { pageTitle } from "../../resources/strings.js"

export const unescapePath = (path) => path.replace(/:/g, "/")

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
    errorPolicy: "all",
  })
  if (error) {
    Sentry.captureException(error)
    return null
  } else {
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
    <div className="admin-flagged-files">
      <div className="header-wrap ">
        <h2>Flagged Annexed Files</h2>
      </div>

      <div className="filters-sort-wrap">
        <span>
          <div className="filters">
            <label>Filter By:</label>
            <button
              className={includeFlagged ? "active" : null}
              onClick={() => setIncludeFlagged((prev) => !prev)}
            >
              <span className="filter-flagged">
                <i
                  className={includeFlagged
                    ? "fa fa-check-square-o"
                    : "fa fa-square-o"}
                />{" "}
                Flagged
              </span>
            </button>
            <button
              className={includeDeleted ? "active" : null}
              onClick={() => setIncludeDeleted((prev) => !prev)}
            >
              <span className="filter-deleted">
                <i
                  className={includeDeleted
                    ? "fa fa-check-square-o"
                    : "fa fa-square-o"}
                />{" "}
                Deleted
              </span>
            </button>
          </div>
        </span>
      </div>

      <div>
        <div className="users-panel-wrap">
          {loading && <Loading />}
          {data &&
            (data.flaggedFiles.length
              ? (
                data.flaggedFiles.map((flaggedFile, key) => (
                  <FlaggedItem {...flaggedFile} key={key} />
                ))
              )
              : <h4>No Results Found</h4>)}
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
  `/datasets/${datasetId}${snapshot === "HEAD" ? "" : `/versions/${snapshot}`}`

const FlaggedItem = ({
  datasetId,
  snapshot,
  filepath,
  flagger: { name, email },
}) => {
  return (
    <div className="user-panel">
      <div className="user-col uc-dataset">
        <label>Dataset : Snapshot</label>
        <Link to={datasetUrlPath(datasetId, snapshot)}>
          {datasetId}
          {" : "}
          {snapshot}
        </Link>
      </div>
      <div className="user-col uc-file">
        <label>File:</label>
        <span>{unescapePath(filepath)}</span>
      </div>
      <div className="user-col uc-flagger">
        <label>Flagged By:</label>
        {name}
        <br />
        {email}
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

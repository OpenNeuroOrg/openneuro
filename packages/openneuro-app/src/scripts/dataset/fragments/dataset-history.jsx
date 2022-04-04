import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { gql, useQuery } from '@apollo/client'

import Revalidate from '../mutations/revalidate.jsx'
import UpdateRef from '../mutations/update-ref.jsx'

const GET_HISTORY = gql`
  query getHistory($datasetId: ID!) {
    dataset(id: $datasetId) {
      id
      history {
        id
        authorName
        authorEmail
        date
        references
        message
      }
      worker
    }
  }
`

const DatasetHistoryTable = styled.div`
  .row {
    line-height: 1.2em;
  }
  .row:nth-of-type(2n) {
    padding-top: 1em;
  }
  .row:nth-of-type(2n + 1) {
    padding-bottom: 1em;
  }
  .row:nth-of-type(4n),
  .row:nth-of-type(4n + 1) {
    background: #f4f4f4;
  }
`

const DatasetHistory = ({ datasetId }) => {
  const { loading, data } = useQuery(GET_HISTORY, {
    variables: { datasetId },
    errorPolicy: 'all',
  })
  if (loading) {
    return <div className="dataset-history">Loading...</div>
  } else {
    return (
      <div className="dataset-history">
        <h4>Worker Assignment</h4> {data.dataset.worker}
        <h4>Git History</h4>
        <DatasetHistoryTable>
          <div className="grid faux-table-header">
            <h4 className="col-lg col col-2">Commit</h4>
            <h4 className="col-lg col col-3">Date</h4>
            <h4 className="col-lg col col-3">Author</h4>
            <h4 className="col-lg col col-2">References</h4>
            <h4 className="col-lg col col-2 text--right">Action</h4>
          </div>
          {data.dataset.history.map(commit => (
            <React.Fragment key={commit.id}>
              <div className="grid faux-table">
                <div className="commit col-lg col col-2">
                  <label>Commit: </label>
                  {commit.id.slice(0, 8)}
                </div>
                <div className="col-lg col col-3">
                  <label>Date: </label>
                  {commit.date}
                </div>
                <div className="col-lg col col-3">
                  <label>Author: </label>
                  {commit.authorName} &lt;{commit.authorEmail}&gt;
                </div>
                <div className="col-lg col col-2">
                  <label>References: </label>
                  {commit.references}
                </div>
                <div className="col-lg col col-2 grid actions">
                  <Revalidate datasetId={datasetId} revision={commit.id} />
                  <UpdateRef datasetId={datasetId} revision={commit.id} />
                </div>
                <div className="col-lg col col-12">{commit.message}</div>
              </div>
            </React.Fragment>
          ))}
        </DatasetHistoryTable>
      </div>
    )
  }
}

DatasetHistory.propTypes = {
  datasetId: PropTypes.string,
}

export default DatasetHistory

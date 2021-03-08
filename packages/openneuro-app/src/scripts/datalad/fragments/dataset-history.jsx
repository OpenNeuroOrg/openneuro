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
  })
  if (loading) {
    return <div className="dataset-history">Loading...</div>
  } else {
    return (
      <div className="dataset-history">
        <div className="col-lg-6">
          <h3>Worker Assignment</h3> {data.dataset.worker}
        </div>
        <div className="col-lg-12">
          <h3>Git History</h3>
          <DatasetHistoryTable>
            <div className="row">
              <h4 className="col-lg-4">Commit</h4>
              <h4 className="col-lg-2">Date</h4>
              <h4 className="col-lg-2">Author</h4>
              <h4 className="col-lg-2">References</h4>
              <h4 className="col-lg-2">Action</h4>
            </div>
            {data.dataset.history.map(commit => (
              <React.Fragment key={commit.id}>
                <div className="row">
                  <div className="col-lg-4">{commit.id}</div>
                  <div className="col-lg-2">{commit.date}</div>
                  <div className="col-lg-2">
                    {commit.authorName} &lt;{commit.authorEmail}&gt;
                  </div>
                  <div className="col-lg-2">{commit.references}</div>
                  <div className="col-lg-2">
                    <Revalidate datasetId={datasetId} revision={commit.id} />
                    <UpdateRef datasetId={datasetId} revision={commit.id} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">{commit.message}</div>
                </div>
              </React.Fragment>
            ))}
          </DatasetHistoryTable>
        </div>
      </div>
    )
  }
}

DatasetHistory.propTypes = {
  datasetId: PropTypes.string,
}

export default DatasetHistory

import React from 'react'
import PropTypes from 'prop-types'
import DatasetRoutes from '../routes/dataset-routes.jsx'
import Comments from './comments.jsx'
import ErrorBoundary from '../../errors/errorBoundary.jsx'
import DatasetQueryContext from './dataset-query-context.js'

const DatasetMain = ({ dataset }) => {
  return (
    <>
      <ErrorBoundary>
        <DatasetQueryContext.Consumer>
          {({ error }) => <DatasetRoutes dataset={dataset} error={error} />}
        </DatasetQueryContext.Consumer>
      </ErrorBoundary>
      <Comments
        datasetId={dataset.id}
        uploader={dataset.uploader}
        comments={dataset.comments}
      />
    </>
  )
}

DatasetMain.propTypes = {
  dataset: PropTypes.object,
}

export default DatasetMain

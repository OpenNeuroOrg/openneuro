import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import SnapshotContainer from './snapshot-container'
import DraftContainer from './draft-container'

const DatasetRoutes = ({ dataset, error }) => {
  useEffect(() => {
    if (error) {
      throw error
    }
  }, [dataset, error])

  return (
    <Switch>
      <Route
        path="/datasets/:datasetId/versions/:tag"
        render={({
          match: {
            params: { tag },
          },
        }) => {
          return <SnapshotContainer dataset={dataset} tag={tag} />
        }}
      />
      <Route
        path="/datasets/:datasetId"
        render={() => <DraftContainer dataset={dataset} />}
      />
    </Switch>
  )
}

DatasetRoutes.propTypes = {
  dataset: PropTypes.object,
  error: PropTypes.object,
}

export default DatasetRoutes

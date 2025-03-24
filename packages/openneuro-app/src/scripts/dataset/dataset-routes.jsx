import React, { useEffect } from "react"
import PropTypes from "prop-types"
import { Route, Routes } from "react-router-dom"
import SnapshotContainer from "./snapshot-container"
import DraftContainer from "./draft-container"

const DatasetRoutes = ({ dataset, error, stopPolling }) => {
  useEffect(() => {
    if (error) {
      throw error
    }
  }, [dataset, error])

  return (
    <Routes>
      <Route
        path="versions/:tag/*"
        element={
          <SnapshotContainer dataset={dataset} stopPolling={stopPolling} />
        }
      />
      <Route
        path="*"
        element={<DraftContainer dataset={dataset} stopPolling={stopPolling} />}
      />
    </Routes>
  )
}

DatasetRoutes.propTypes = {
  dataset: PropTypes.object,
  error: PropTypes.object,
}

export default DatasetRoutes

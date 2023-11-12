import React, { useEffect } from "react"
import PropTypes from "prop-types"
import { Route, Routes } from "react-router-dom"
import SnapshotContainer from "./snapshot-container"
import DraftContainer from "./draft-container"

const DatasetRoutes = ({ dataset, error }) => {
  useEffect(() => {
    if (error) {
      throw error
    }
  }, [dataset, error])

  return (
    <Routes>
      <Route
        path="versions/:tag/*"
        element={<SnapshotContainer dataset={dataset} />}
      />
      <Route path="*" element={<DraftContainer dataset={dataset} />} />
    </Routes>
  )
}

DatasetRoutes.propTypes = {
  dataset: PropTypes.object,
  error: PropTypes.object,
}

export default DatasetRoutes

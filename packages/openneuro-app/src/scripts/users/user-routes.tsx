import React, { useEffect } from "react"
import PropTypes from "prop-types"
import { Route, Routes } from "react-router-dom"
import UserAccountContainer from "./user-account-container"

const DatasetRoutes = ({ user, error }) => {
  useEffect(() => {
    if (error) {
      throw error
    }
  }, [user, error])

  return (
    <Routes>
    <Route
        path="account"
        element={<>test</>}
      />
      <Route path="*" element={<UserAccountContainer user={user} />} /> 
    </Routes>
  )
}

DatasetRoutes.propTypes = {
  dataset: PropTypes.object,
  error: PropTypes.object,
}

export default DatasetRoutes

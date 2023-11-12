import React from "react"
import { Route, Routes } from "react-router-dom"
import DatasetQuery from "./dataset-query"

const Dataset = () => {
  return (
    <Routes>
      <Route path=":datasetId/*" element={<DatasetQuery />} />
    </Routes>
  )
}

export default Dataset

import React from "react"

// Default comment depth is set here
const DatasetQueryContext = React.createContext({
  datasetId: null,
  fetchMore: null,
  error: null,
  stopPolling: null,
  startPolling: null,
})

export default DatasetQueryContext

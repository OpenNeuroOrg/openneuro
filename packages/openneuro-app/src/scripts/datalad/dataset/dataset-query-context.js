import React from 'react'

// Global context for a dataset query and children
const DatasetQueryContext = React.createContext({
  datasetId: null,
  refetch: () => {},
})

export default DatasetQueryContext

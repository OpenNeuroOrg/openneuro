import React from 'react'
import { Query } from 'react-apollo'
import { datasets } from 'openneuro-client'
import Spinner from '../../../common/partials/spinner.jsx'
import DashboardDatasetsPage from './dashboard.datasets-page.jsx'

const DataladDashboard = () => (
  <Query query={datasets.getDatasets}>
    {({ loading, error, data }) => {
      console.log(data)
      if (loading) {
        return <Spinner text="Loading Datasets" active />
      } else if (error) {
        throw new Error(error)
      } else {
        return <DashboardDatasetsPage datasets={data.datasets} />
      }
    }}
  </Query>
)

export default DataladDashboard

import React, { useState } from "react"
import { DatasetCard } from "./dataset-card"
import { UserDatasetFilters } from "./components/user-dataset-filters"
import { gql, useQuery } from "@apollo/client"
import styles from "./scss/datasetcard.module.scss"
import type { Dataset, UserDatasetsViewProps } from "../types/user-types"
import { INDEX_DATASET_FRAGMENT } from "./fragments/query"
import { filterAndSortDatasets } from "../utils/user-datasets"

export const DATASETS_QUERY = gql`
query Datasets($first: Int) {
  datasets(first: $first) {
      edges {
        node {
         ...DatasetIndex
        }
      }
    }
  }
  ${INDEX_DATASET_FRAGMENT}
`

export const UserDatasetsView: React.FC<UserDatasetsViewProps> = (
  { user, hasEdit },
) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [publicFilter, setPublicFilter] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<string>("date-updated")

  const { data, loading, error } = useQuery(DATASETS_QUERY, {
    variables: { first: 25 },
  })

  if (loading) return <p>Loading datasets...</p>
  if (error) return <p>Failed to fetch datasets: {error.message}</p>

  const datasets: Dataset[] =
    data?.datasets?.edges?.map((edge: { node: Dataset }) => edge.node) || []

  const filteredAndSortedDatasets = filterAndSortDatasets(datasets, {
    searchQuery,
    publicFilter,
    sortOrder,
  })

  return (
    <div data-testid="user-datasets-view">
      <h3>{user.name}'s Datasets</h3>

      <UserDatasetFilters
        publicFilter={publicFilter}
        setPublicFilter={setPublicFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className={styles.userDsWrap}>
        {filteredAndSortedDatasets.length > 0
          ? filteredAndSortedDatasets.map((dataset) => (
            <DatasetCard key={dataset.id} dataset={dataset} hasEdit={hasEdit} />
          ))
          : <p>No datasets found.</p>}
      </div>
    </div>
  )
}

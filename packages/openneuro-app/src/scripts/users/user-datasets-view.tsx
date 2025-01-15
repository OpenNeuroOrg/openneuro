import React, { useState } from "react"
import { DatasetCard } from "./components/dataset-card"
import { UserDatasetFilters } from "./components/user-dataset-filters"
import { gql, useQuery } from "@apollo/client"
import styles from "./scss/datasetcard.module.scss"

interface User {
  name: string
}

interface Dataset {
  id: string
  created: string
  name: string
  public: boolean
  analytics: {
    views: number
    downloads: number
  }
  stars: [{ userId: string; datasetId: string }]
  followers: [{ userId: string; datasetId: string }]
  latestSnapshot?: {
    id: string
    size: number
    issues: [{ severity: string }]
    created?: string
  }
}

interface UserDatasetsViewProps {
  user: User
  hasEdit: boolean
}

const DATASETS_QUERY = gql`
  query GetDatasets($first: Int) {
    datasets(first: $first) {
      edges {
        node {
          id
          created
          name
          public
          analytics {
            views
            downloads
          }
          stars {
            userId
            datasetId
          }
          followers {
            userId
            datasetId
          }
          latestSnapshot {
            id
            size
            created
            issues {
              severity
            }
            description {
              Authors
            }
          }
        }
      }
    }
  }
`

export const UserDatasetsView: React.FC<UserDatasetsViewProps> = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [publicFilter, setPublicFilter] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<string>("date-updated")

  const { data, loading, error } = useQuery(DATASETS_QUERY)

  if (loading) return <p>Loading datasets...</p>
  if (error) return <p>Failed to fetch datasets: {error.message}</p>

  const datasets: Dataset[] =
    data?.datasets?.edges?.map((edge: { node: Dataset }) => edge.node) || []

  const filteredDatasets = datasets
    .filter((dataset) => {
      const matchesSearch = (dataset.name &&
        dataset.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (dataset.id &&
          dataset.id.toLowerCase().includes(searchQuery.toLowerCase())) // Add check for dataset.id
      const matchesPublicFilter = publicFilter === "all" ||
        (publicFilter === "public" && dataset.public) ||
        (publicFilter === "private" && !dataset.public)
      return matchesSearch && matchesPublicFilter
    })
    .sort((a, b) => {
      let result = 0

      switch (sortOrder) {
        case "name-asc": {
          const aName = a.name || ""
          const bName = b.name || ""
          result = aName.localeCompare(bName)
          break
        }
        case "name-desc": {
          const aName = a.name || ""
          const bName = b.name || ""
          result = bName.localeCompare(aName)
          break
        }
        case "date-newest": {
          result = new Date(b.created).getTime() - new Date(a.created).getTime()
          break
        }
        case "date-updated": {
          const aUpdated = a.latestSnapshot?.created || a.created
          const bUpdated = b.latestSnapshot?.created || b.created
          result = new Date(bUpdated).getTime() - new Date(aUpdated).getTime()
          break
        }
        default: {
          result = 0
          break
        }
      }

      return result
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
        {filteredDatasets.length > 0
          ? (
            filteredDatasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))
          )
          : <p>No datasets found.</p>}
      </div>
    </div>
  )
}

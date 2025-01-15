import React, { useState } from "react"
import { DatasetCard } from "./components/dataset-card"
import { UserDatasetFilters } from "./components/user-dataset-filters"
import styles from "./scss/datasetcard.module.scss"

interface User {
  name: string
}

interface Dataset {
  id: string
  created: string
  ownerId: string
  name: string
  public: boolean
  analytics: {
    views: number
    downloads: number
  }
  stars: Array<{ userId: string; datasetId: string }>
  followers: Array<{ userId: string; datasetId: string }>
  latestSnapshot?: {
    id: string
    size: number
    issues: Array<{ severity: string }>
    created?: string // Added created date to latestSnapshot
  }
}

interface UserDatasetsViewProps {
  user: User
  hasEdit: boolean
}

const dummyDatasets: Dataset[] = [
  {
    id: "ds00001",
    created: "2023-11-01T12:00:00Z",
    ownerId: "1",
    name:
      "[18F]SF51, a Novel 18F-labeled PET Radioligand for Translocator Protein 18kDa (TSPO) in Brain, Works Well in Monkeys but Fails in Humans",
    public: true,
    analytics: {
      views: 123,
      downloads: 132,
    },
    stars: [
      {
        userId: "string",
        datasetId: "string",
      },
    ],
    followers: [
      {
        userId: "string",
        datasetId: "string",
      },
    ],
    latestSnapshot: {
      id: "string",
      size: 123,
      created: "2023-12-01T12:00:00Z", // Example created date for latest snapshot
      issues: [
        {
          severity: "string",
        },
      ],
    },
  },
  {
    id: "ds00002",
    created: "2023-11-02T12:00:00Z",
    ownerId: "2",
    name: "Dataset 2",
    public: false,
    analytics: {
      views: 123,
      downloads: 132,
    },
    stars: [
      {
        userId: "string",
        datasetId: "string",
      },
    ],
    followers: [
      {
        userId: "string",
        datasetId: "string",
      },
    ],
    latestSnapshot: {
      id: "string",
      size: 123,
      created: "2023-11-15T12:00:00Z", // Example created date for latest snapshot
      issues: [
        {
          severity: "string",
        },
      ],
    },
  },
  {
    id: "ds00003",
    created: "2023-11-02T12:00:00Z",
    ownerId: "2",
    name: "Dataset 3",
    public: true,
    analytics: {
      views: 123,
      downloads: 132,
    },
    stars: [
      {
        userId: "string",
        datasetId: "string",
      },
    ],
    followers: [
      {
        userId: "string",
        datasetId: "string",
      },
    ],
    latestSnapshot: {
      id: "string",
      size: 123,
      created: "2023-12-10T12:00:00Z", // Example created date for latest snapshot
      issues: [
        {
          severity: "string",
        },
      ],
    },
  },
]

export const UserDatasetsView: React.FC<UserDatasetsViewProps> = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [publicFilter, setPublicFilter] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<string>("date-updated") // Default sort by "date-updated"

  const filteredDatasets = dummyDatasets
    .filter((dataset) => {
      const matchesSearch =
        dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dataset.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPublicFilter = publicFilter === "all" ||
        (publicFilter === "public" && dataset.public) ||
        (publicFilter === "private" && !dataset.public)
      return matchesSearch && matchesPublicFilter
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case "name-asc":
          return a.name.localeCompare(b.name) // A-Z by name
        case "name-desc":
          return b.name.localeCompare(a.name) // Z-A by name
        case "date-newest":
          return new Date(b.created).getTime() - new Date(a.created).getTime() // Newest first
        case "date-updated":
          const aUpdated = a.latestSnapshot?.created || a.created
          const bUpdated = b.latestSnapshot?.created || b.created
          return new Date(bUpdated).getTime() - new Date(aUpdated).getTime() // Most recently updated first
        default:
          return 0
      }
    })

  return (
    <div data-testid="user-datasets-view">
      <h3>{user.name}'s Datasets</h3>

      {/* Filters and Sort Component */}
      <UserDatasetFilters
        publicFilter={publicFilter}
        setPublicFilter={setPublicFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        datasets={filteredDatasets} // Pass filtered datasets
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

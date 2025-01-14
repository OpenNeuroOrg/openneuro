import React from "react"
import { DatasetCard } from "./components/dataset-card"
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
      issues: [
        {
          severity: "string",
        },
      ],
    },
  },
]

export const UserDatasetsView: React.FC<UserDatasetsViewProps> = ({ user }) => {
  return (
    <div data-testid="user-datasets-view">
      <h3>{user.name}'s Datasets</h3>
      <div className={styles.userDsWrap}>
        {dummyDatasets.map((dataset) => (
          <DatasetCard key={dataset.id} dataset={dataset} />
        ))}
      </div>
    </div>
  )
}

export default UserDatasetsView

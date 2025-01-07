import React from "react"

interface User {
  name: string
}

interface Dataset {
  id: string
  created: string
  ownerId: string
  name: string
  type: string
}

interface UserDatasetsViewProps {
  user: User
}

const dummyDatasets: Dataset[] = [
  {
    id: "ds00001",
    created: "2023-11-01T12:00:00Z",
    ownerId: "1",
    name: "Dataset 1",
    type: "public",
  },
  {
    id: "ds00002",
    created: "2023-11-02T12:00:00Z",
    ownerId: "2",
    name: "Dataset 2",
    type: "private",
  },
]

export const UserDatasetsView: React.FC<UserDatasetsViewProps> = ({ user }) => {
  return (
    <div data-testid="user-datasets-view">
      <h1>{user.name}'s Datasets</h1>
      <div>
        {dummyDatasets.map((dataset) => (
          <div key={dataset.id} data-testid={`dataset-${dataset.id}`}>
            <h2>{dataset.name}</h2>
            <p>Type: {dataset.type}</p>
            <p>Created: {dataset.created}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserDatasetsView

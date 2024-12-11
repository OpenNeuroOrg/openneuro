import React from 'react';
import PropTypes from 'prop-types';
import { UserDatasetItem } from './user-dataset-item';

interface User {
  name: string;
}

interface Dataset {
  id: string;
  created: string;
  ownerId: string;
  name: string;
  type: string;
}

interface UserDatasetsViewProps {
  user: User;
}

const dummyDatasets: Dataset[] = [
  {
    id: 'ds00001',
    created: '2023-11-01T12:00:00Z',
    ownerId: '1',
    name: 'Dataset 1',
    type: 'public',
  },
  {
    id: 'ds00002',
    created: '2023-11-02T12:00:00Z',
    ownerId: '2',
    name: 'Dataset 2',
    type: 'private',
  },
];
// this is a placeholder for the user dataset page features. 
export const UserDatasetsView: React.FC<UserDatasetsViewProps> = ({ user }) => {
  return (
    <div data-testid="user-datasets-view">
      <h1>{user.name}'s Datasets</h1>
      <div>
        {dummyDatasets.map((dataset) => (
          <UserDatasetItem key={dataset.id} dataset={dataset} />
        ))}
      </div>
    </div>
  );
};

export default UserDatasetsView;

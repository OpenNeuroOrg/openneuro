import React from 'react';
import PropTypes from 'prop-types';
import UserDatasetItem from './user-dataset-item';

const dummyUsers = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
];

const dummyDatasets = [
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

const UserDatasets = ({ user }) => {
  const userDatasets = dummyDatasets.filter((dataset) => dataset.ownerId === user.id);

  return (
    <div>
      <h1>{user.name}'s Datasets</h1>
      <div>
        {userDatasets.map((dataset) => (
          <UserDatasetItem key={dataset.id} dataset={dataset} user={user} />
        ))}
      </div>
    </div>
  );
};

UserDatasets.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default UserDatasets;
import React from 'react';

interface UserDatasetItemProps {
  dataset: {
    id: string;
    name: string;
    type: string;
    created: string;
  };
}

export const UserDatasetItem: React.FC<UserDatasetItemProps> = ({ dataset }) => {
  return (
    <div>
      <h2>{dataset.name}</h2>
      <p>Type: {dataset.type}</p>
      <p>Created: {new Date(dataset.created).toLocaleDateString()}</p>
    </div>
  );
};
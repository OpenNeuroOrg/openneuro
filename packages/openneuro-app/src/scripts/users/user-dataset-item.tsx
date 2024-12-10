import React from 'react';
import PropTypes from 'prop-types';

const UserDatasetItem = ({ dataset, user }) => {
  return (
    <div>
      <h2>{dataset.name}</h2>
      <p>Type: {dataset.type}</p>
      <p>Owner: {user.name}</p>
    </div>
  );
};

UserDatasetItem.propTypes = {
  dataset: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default UserDatasetItem;
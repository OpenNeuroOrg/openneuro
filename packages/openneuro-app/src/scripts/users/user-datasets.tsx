import React from "react";

export const UserDatasets = ({ user }) => {
  return (
    <div className="test-view">
      <h3>User Datasets for {user.name}</h3>
      <p>Should show datasets based on the user</p>
    </div>
  );
};


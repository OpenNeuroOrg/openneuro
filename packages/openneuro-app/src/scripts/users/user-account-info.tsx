import React from "react";

export const UserAccountPage = ({ user }) => {
  return (
    <div className="test-view">
      <h3>UserAccountPage for {user.name}</h3>
      <p>This should show user info</p>
    </div>
  );
};


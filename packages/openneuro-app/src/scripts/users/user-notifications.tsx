import React from "react";

export const UserNotificationsPage = ({ user }) => {
    return (
        <div className="test-view">
            <h3>UserNotificationsPAge for {user.name}</h3>
            <p>This should show user info</p>
        </div>
    );
};


import React from "react";

export const UserNotificationsView = ({ user }) => {
    // this is a placeholder for the user notification feature
    return (
        <div data-testid="user-notifications-view">
            <h3>UserNotificationsPAge for {user.name}</h3>
            <p>This should show user info</p>
        </div>
    );
};


import React from "react"

export const UserNotificationsView = ({ user }) => {
  // this is a placeholder for the user notification feature
  return (
    <div data-testid="user-notifications-view">
      <h3>Notifications for {user.name}</h3>
      <p>No notifications.</p>
    </div>
  )
}

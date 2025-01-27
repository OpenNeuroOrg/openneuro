import React, { useState } from "react"
import styles from "./scss/usernotifications.module.scss"
import { NotificationAccordion } from "./user-notification-accordion"

// NotificationsList Component
export const NotificationsList = ({ notificationdata }) => {
  const [notifications, setNotifications] = useState(notificationdata)

  const handleUpdateNotification = (id, updates) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, ...updates } : notification
      )
    )
  }
  return (
    <ul className={styles.notificationsList}>
      {notifications.map((notification) => (
        <NotificationAccordion
          key={notification.id}
          notification={notification}
          onUpdate={handleUpdateNotification}
        />
      ))}
    </ul>
  )
}

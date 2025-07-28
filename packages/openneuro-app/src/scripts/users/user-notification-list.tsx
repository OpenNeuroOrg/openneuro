import React, { useState } from "react"
import styles from "./scss/usernotifications.module.scss"
import { NotificationAccordion } from "./user-notification-accordion"
import { MappedNotification } from "../types/user-types"

export const NotificationsList = (
  { notificationdata }: { notificationdata: MappedNotification[] },
) => {
  const [notifications, setNotifications] = useState<MappedNotification[]>(
    notificationdata,
  )

  const handleUpdateNotification = (
    id: string,
    updates: Partial<MappedNotification>,
  ) => {
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

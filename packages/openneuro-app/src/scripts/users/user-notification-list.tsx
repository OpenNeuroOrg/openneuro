import React from "react"
import styles from "./scss/usernotifications.module.scss"
import { NotificationAccordion } from "./user-notification-accordion"
import type { MappedNotification } from "../types/event-types"

export const NotificationsList = (
  { notificationdata, onUpdate }: {
    notificationdata: MappedNotification[]
    onUpdate: (id: string, updates: Partial<MappedNotification>) => void
  },
) => {
  return (
    <ul className={styles.notificationsList}>
      {notificationdata.map((notification) => (
        <NotificationAccordion
          key={notification.id}
          notification={notification}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  )
}

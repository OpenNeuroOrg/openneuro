import React from "react"
import styles from "./scss/usernotifications.module.scss"
import { NotificationAccordion } from "./user-notification-accordion"
import type { MappedNotification } from "../../types/event-types"

interface NotificationsListProps {
  notificationdata: MappedNotification[]
  onUpdate: (id: string, updates: Partial<MappedNotification>) => void
}

export const NotificationsList: React.FC<NotificationsListProps> = ({
  notificationdata,
  onUpdate,
}) => (
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

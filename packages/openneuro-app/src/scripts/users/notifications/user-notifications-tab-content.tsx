import React from "react"
import { NotificationsList } from "./user-notification-list"
import { useNotifications } from "./user-notifications-context"

interface NotificationTabProps {
  status: "unread" | "saved" | "archived"
  testId: string
  className: string
}

const NotificationTab: React.FC<NotificationTabProps> = (
  { status, testId, className },
) => {
  const { notifications, handleUpdateNotification } = useNotifications()
  const filteredNotifications = notifications.filter((n) => n.status === status)

  return (
    <div className={className} data-testid={testId}>
      <NotificationsList
        notificationdata={filteredNotifications}
        onUpdate={handleUpdateNotification}
      />
    </div>
  )
}

export const UnreadNotifications = () => (
  <NotificationTab
    status="unread"
    testId="unread-notifications"
    className="tabContentUnread"
  />
)

export const SavedNotifications = () => (
  <NotificationTab
    status="saved"
    testId="saved-notifications"
    className="tabContentSaved"
  />
)

export const ArchivedNotifications = () => (
  <NotificationTab
    status="archived"
    testId="archived-notifications"
    className="tabContentArchived"
  />
)

import React from "react"
import { NotificationsList } from "./user-notification-list"
import { useOutletContext } from "react-router-dom"
import type { OutletContextType } from "../types/user-types"

export const UnreadNotifications = () => {
  const { notifications, handleUpdateNotification } =
    useOutletContext() as OutletContextType
  const unreadData = notifications.filter((notification) =>
    notification.status === "unread"
  )
  return (
    <div className="tabContentUnread" data-testid="unread-notifications">
      <NotificationsList
        notificationdata={unreadData}
        onUpdate={handleUpdateNotification}
      />
    </div>
  )
}

export const SavedNotifications = () => {
  const { notifications, handleUpdateNotification } =
    useOutletContext() as OutletContextType
  const savedData = notifications.filter((notification) =>
    notification.status === "saved"
  )
  return (
    <div className="tabContentSaved" data-testid="saved-notifications">
      <NotificationsList
        notificationdata={savedData}
        onUpdate={handleUpdateNotification}
      />
    </div>
  )
}

export const ArchivedNotifications = () => {
  const { notifications, handleUpdateNotification } =
    useOutletContext() as OutletContextType
  const archivedData = notifications.filter((notification) =>
    notification.status === "archived"
  )
  return (
    <div className="tabContentArchived" data-testid="archived-notifications">
      <NotificationsList
        notificationdata={archivedData}
        onUpdate={handleUpdateNotification}
      />
    </div>
  )
}

import React from "react"
import { NotificationsList } from "./user-notification-list"
import { useOutletContext } from "react-router-dom"

import {
  DatasetEventGraphQL,
  MappedNotification,
  OutletContextType,
} from "../types/user-types"

const mapNotificationToAccordionProps = (
  notification: DatasetEventGraphQL,
): MappedNotification => {
  const event = notification.event
  let title = "General Notification"
  let status: "unread" | "saved" | "archived" = "unread"
  let type: "general" | "approval" = "general"
  let approval: "" | "not provided" | "denied" | "approved" | "accepted" = ""

  switch (event?.type) {
    case "contributorRequest":
      title = `Contributor Request for Dataset ${
        notification.dataset?.name || notification.dataset?.id ||
        notification.id
      }`
      type = "approval"
      approval = "not provided"
      break
    case "contributorResponse":
      title = `Contributor Request ${event.status} for Dataset ${
        notification.dataset?.name || notification.dataset?.id ||
        notification.id
      }`
      type = "approval"
      approval = event.status as ("accepted" | "denied")
      break
    case "note":
      title = `Admin Note on Dataset ${
        notification.dataset?.name || notification.dataset?.id ||
        notification.id
      }`
      break
    default:
      title = notification.note ||
        `Event on Dataset ${
          notification.dataset?.name || notification.dataset?.id ||
          notification.id
        }`
  }

  return {
    id: notification.id,
    title: title,
    content: notification.note || "",
    status: status,
    type: type,
    approval: approval,
    originalNotification: notification,
  }
}

export const UnreadNotifications = () => {
  const { notifications } = useOutletContext() as OutletContextType

  const unreadData = notifications
    .map(mapNotificationToAccordionProps)
    .filter((notification) => notification.status === "unread")
  return (
    <div className="tabContentUnread">
      <NotificationsList notificationdata={unreadData} />
    </div>
  )
}

export const SavedNotifications = () => {
  const { notifications } = useOutletContext() as OutletContextType

  const savedData = notifications
    .map(mapNotificationToAccordionProps)
    .filter((notification) => notification.status === "saved")
  return (
    <div className="tabContentSaved">
      <NotificationsList notificationdata={savedData} />
    </div>
  )
}

export const ArchivedNotifications = () => {
  const { notifications } = useOutletContext() as OutletContextType

  const archivedData = notifications
    .map(mapNotificationToAccordionProps)
    .filter((notification) => notification.status === "archived")
  return (
    <div className="tabContentArchived">
      <NotificationsList notificationdata={archivedData} />
    </div>
  )
}

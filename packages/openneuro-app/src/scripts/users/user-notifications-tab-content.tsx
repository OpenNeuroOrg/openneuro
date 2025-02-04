import React from "react"
import { NotificationsList } from "./user-notification-list"

// Dummy notifications
const dummyNotifications = [
  {
    id: 1,
    title: "New Comment on Your dataset",
    content: "A user has commented on your dataset. View here",
    status: "unread",
    type: "general",
    approval: "",
  },
  {
    id: 2,
    title: "Example No Approval State ",
    content: "",
    status: "unread",
    type: "approval",
    approval: "not provided",
  },
  {
    id: 3,
    title: "Example Denied State",
    content: "",
    status: "unread",
    type: "approval",
    approval: "denied",
  },
  {
    id: 4,
    title: "Example Approved State",
    content: "",
    status: "unread",
    type: "approval",
    approval: "approved",
  },
  {
    id: 5,
    title: "Saved Notification Example",
    content: "This is an example of a saved notification.",
    status: "saved",
    type: "general",
    approval: "",
  },
  {
    id: 6,
    title: "Archived Notification Example",
    content: "This is an example of an archived notification.",
    status: "archived",
    type: "general",
    approval: "",
  },
]

// Tab Components for Different Notifications
export const UnreadNotifications = () => (
  <div className="tabContentUnread">
    <NotificationsList
      notificationdata={dummyNotifications.filter(
        (notification) => notification.status === "unread",
      )}
    />
  </div>
)

export const SavedNotifications = () => (
  <div className="tabContentSaved">
    <NotificationsList
      notificationdata={dummyNotifications.filter(
        (notification) => notification.status === "saved",
      )}
    />
  </div>
)

export const ArchivedNotifications = () => (
  <div className="tabContentArchived">
    <NotificationsList
      notificationdata={dummyNotifications.filter(
        (notification) => notification.status === "archived",
      )}
    />
  </div>
)

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import * as Sentry from "@sentry/react"
import { useMutation } from "@apollo/client"
import { UPDATE_NOTIFICATION_STATUS_MUTATION } from "../../queries/datasetEvents"
import {
  type MappedNotification,
  mapRawEventToMappedNotification,
} from "../../types/event-types"
import { useUser } from "../../queries/user"

interface NotificationsContextValue {
  notifications: MappedNotification[]
  setNotifications: React.Dispatch<React.SetStateAction<MappedNotification[]>>
  handleUpdateNotification: (
    id: string,
    updates: Partial<MappedNotification>,
  ) => Promise<void>
}

interface NotificationsProviderProps {
  children: React.ReactNode
  userId?: string
}

const NotificationsContext = createContext<
  NotificationsContextValue | undefined
>(undefined)

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({
  children,
  userId,
}) => {
  const { user } = useUser(userId)
  const [notifications, setNotifications] = useState<MappedNotification[]>([])

  useEffect(() => {
    const mapped = user?.notifications?.map(mapRawEventToMappedNotification) ??
      []
    setNotifications(mapped)
  }, [user?.notifications])
  const [updateEventStatus] = useMutation(UPDATE_NOTIFICATION_STATUS_MUTATION)

  const handleUpdateNotification = useCallback(
    async (id: string, updates: Partial<MappedNotification>) => {
      // Update local state immediately
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
      )

      // Persist change to backend if status is updated
      if (updates.status) {
        try {
          await updateEventStatus({
            variables: { eventId: id, status: updates.status.toUpperCase() },
          })
        } catch (err) {
          Sentry.captureException(err)
        }
      }
    },
    [updateEventStatus],
  )

  return (
    <NotificationsContext.Provider
      value={{ notifications, setNotifications, handleUpdateNotification }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider",
    )
  }
  return context
}

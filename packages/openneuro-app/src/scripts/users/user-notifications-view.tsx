import React, { useEffect, useRef, useState } from "react"
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom"
import styles from "./scss/usernotifications.module.scss"
import iconUnread from "../../assets/icon-unread.png"
import iconSaved from "../../assets/icon-saved.png"
import iconArchived from "../../assets/icon-archived.png"
import { useUser } from "../queries/user"
import { Loading } from "../components/loading/Loading"
import * as Sentry from "@sentry/react"
import { mapRawEventToMappedNotification } from "../types/event-types"
import {
  NotificationsProvider,
  useNotifications,
} from "./user-notifications-context"
import type { UserNotificationsViewProps } from "../types/user-types"

export const UserNotificationsView: React.FC<UserNotificationsViewProps> = (
  { orcidUser },
) => {
  const tabsRef = useRef<HTMLUListElement>(null)
  const { tab = "unread" } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading, error } = useUser(orcidUser.id)

  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({
    width: "0px",
    transform: "translateX(0px)",
    position: "absolute",
    bottom: "0px",
    height: "2px",
    backgroundColor: "#000",
    transition: "transform 0.3s ease, width 0.3s ease",
  })

  useEffect(() => {
    const activeLink = tabsRef.current?.querySelector(`.${styles.active}`)
      ?.parentElement
    if (activeLink) {
      setIndicatorStyle({
        width: `${activeLink.offsetWidth}px`,
        transform: `translateX(${activeLink.offsetLeft}px)`,
        position: "absolute",
        bottom: "0px",
        height: "2px",
        backgroundColor: "#000",
        transition: "transform 0.3s ease, width 0.3s ease",
      })
    }
  }, [location])

  useEffect(() => {
    if (!["unread", "saved", "archived"].includes(tab)) {
      navigate(`/user/${orcidUser.orcid}/notifications/unread`, {
        replace: true,
      })
    }
  }, [tab, orcidUser.orcid, navigate])

  if (loading) return <Loading />
  if (error) {
    Sentry.captureException(error)
    return (
      <div>Error loading notifications: {error.message}. Please try again.</div>
    )
  }

  const initialNotifications =
    user?.notifications.map(mapRawEventToMappedNotification) || []

  return (
    <NotificationsProvider initialNotifications={initialNotifications}>
      <div data-testid="user-notifications-view">
        <h3>Notifications for {orcidUser.name}</h3>
        <div className={styles.tabContainer}>
          <ul className={styles.tabs} ref={tabsRef}>
            {[
              {
                status: "unread",
                icon: iconUnread,
                label: "Unread",
                tabClass: styles.tabUnread,
              },
              {
                status: "saved",
                icon: iconSaved,
                label: "Saved",
                tabClass: styles.tabSaved,
              },
              {
                status: "archived",
                icon: iconArchived,
                label: "Archived",
                tabClass: styles.tabArchived,
              },
            ].map(({ status, icon, label, tabClass }) => (
              <li key={status}>
                <NavLink
                  to={`/user/${orcidUser.orcid}/notifications/${status}`}
                  className={({ isActive }) =>
                    isActive ? `${styles.active} ${tabClass}` : tabClass}
                >
                  <img className={styles.tabicon} src={icon} alt="" /> {label}
                  <TabCount
                    status={status as "unread" | "saved" | "archived"}
                  />
                </NavLink>
              </li>
            ))}
          </ul>
          <span style={indicatorStyle} />
        </div>
        <div className={styles.tabContent}>
          <Outlet />
        </div>
      </div>
    </NotificationsProvider>
  )
}

interface TabCountProps {
  status: "unread" | "saved" | "archived"
}

const TabCount: React.FC<TabCountProps> = ({ status }) => {
  const { notifications } = useNotifications()
  const count = notifications.filter((n) => n.status === status).length
  return <span className={styles.count}>{count}</span>
}

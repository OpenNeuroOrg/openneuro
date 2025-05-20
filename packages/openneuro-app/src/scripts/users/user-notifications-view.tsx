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

export const UserNotificationsView = ({ orcidUser }) => {
  const tabsRef = useRef<HTMLUListElement | null>(null)
  const { tab = "unread" } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Explicitly define the type of indicatorStyle
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({
    width: "0px",
    transform: "translateX(0px)",
    position: "absolute",
    bottom: "0px",
    height: "2px",
    backgroundColor: "#000",
    transition: "transform 0.3s ease, width 0.3s ease",
  })

  // Update the indicator position based on active tab whenever location changes
  useEffect(() => {
    const activeLink = tabsRef.current?.querySelector(`.${styles.active}`)
    if (activeLink) {
      const li = activeLink.parentElement as HTMLElement
      if (li) {
        setIndicatorStyle({
          width: `${li.offsetWidth}px`,
          transform: `translateX(${li.offsetLeft}px)`,
          position: "absolute",
          bottom: "0px",
          height: "2px",
          backgroundColor: "#000",
          transition: "transform 0.3s ease, width 0.3s ease",
        })
      }
    }
  }, [location])

  // Redirect to default tab if no tab is specified
  useEffect(() => {
    if (!["unread", "saved", "archived"].includes(tab)) {
      navigate(`/user/${orcidUser.orcid}/notifications/unread`, {
        replace: true,
      })
    }
  }, [tab, orcidUser.orcid, navigate])

  return (
    <div data-testid="user-notifications-view">
      <h3>Notifications for {orcidUser.name}</h3>
      <div className={styles.tabContainer}>
        <ul className={styles.tabs} ref={tabsRef}>
          <li>
            <NavLink
              to={`/user/${orcidUser.orcid}/notifications/unread`}
              className={({ isActive }) =>
                isActive
                  ? `${styles.active} ${styles.tabUnread}`
                  : styles.tabUnread}
            >
              <img className={styles.tabicon} src={iconUnread} alt="" /> Unread
              <span className={styles.count}>121</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/user/${orcidUser.orcid}/notifications/saved`}
              className={({ isActive }) =>
                isActive
                  ? `${styles.active} ${styles.tabSaved}`
                  : styles.tabSaved}
            >
              <img className={styles.tabicon} src={iconSaved} alt="" /> Saved
              <span className={styles.count}>121</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/user/${orcidUser.orcid}/notifications/archived`}
              className={({ isActive }) =>
                isActive
                  ? `${styles.active} ${styles.tabArchived}`
                  : styles.tabArchived}
            >
              <img className={styles.tabicon} src={iconArchived} alt="" />{" "}
              Archived
              <span className={styles.count}>121</span>
            </NavLink>
          </li>
        </ul>

        {/* This is the indicator that will follow the active tab */}
        <span style={indicatorStyle}></span>
      </div>
      <div className={styles.tabContent}>
        <Outlet />
      </div>
    </div>
  )
}

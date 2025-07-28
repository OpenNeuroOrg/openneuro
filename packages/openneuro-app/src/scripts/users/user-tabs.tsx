import React, { useEffect, useRef, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import styles from "./scss/usertabs.module.scss"

export interface UserAccountTabsProps {
  hasEdit: boolean
  isUser?: boolean
}

export const UserAccountTabs: React.FC<UserAccountTabsProps> = (
  { hasEdit, isUser },
) => {
  const ulRef = useRef<HTMLUListElement>(null)
  const [activePosition, setActivePosition] = useState<number>(0)
  const [clicked, setClicked] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const activeLink = ulRef.current?.querySelector(
      `.${styles.active}`,
    ) as HTMLElement
    if (activeLink) {
      const li = activeLink.parentElement as HTMLElement
      setActivePosition(li.offsetTop)
    }
  }, [location])

  const handleClick = () => {
    setClicked(true)
  }

  if (!hasEdit) return null

  return (
    <div className={styles.userAccountTabLinks}>
      <ul
        ref={ulRef}
        className={`${clicked ? "clicked" : ""} ${styles.userAccountTabLinks}`}
        style={{
          "--active-offset": `${activePosition}px`,
        } as React.CSSProperties}
      >
        <li>
          <NavLink
            to=""
            end
            className={({ isActive }) => (isActive ? styles.active : "")}
            onClick={handleClick}
          >
            {isUser ? "My" : "User"} Datasets
          </NavLink>
        </li>
        <li>
          <NavLink
            data-testid="user-notifications-tab"
            to="notifications"
            className={({ isActive }) => (isActive ? styles.active : "")}
            onClick={handleClick}
          >
            Notifications
          </NavLink>
        </li>

        <li>
          <NavLink
            to="account"
            className={({ isActive }) => (isActive ? styles.active : "")}
            onClick={handleClick}
          >
            Account Info
          </NavLink>
        </li>
      </ul>
    </div>
  )
}

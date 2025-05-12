import React from "react"
import { Outlet } from "react-router-dom"
import { UserCard } from "./user-card"
import { UserAccountTabs } from "./user-tabs"
import styles from "./scss/usercontainer.module.scss"
import type { AccountContainerProps } from "../types/user-types"

export const UserAccountContainer: React.FC<AccountContainerProps> = ({
  orcidUser,
  hasEdit,
  isUser,
}) => {
  return (
    <>
      <div className="container">
        <header className={styles.userHeader}>
          {orcidUser.avatar && (
            <img
              className={styles.avatar}
              src={orcidUser.avatar}
              alt={orcidUser.name}
            />
          )}
          <h2 className={styles.username}>{orcidUser.name}</h2>
        </header>
      </div>
      <div className={styles.usercontainer + " container"}>
        <section className={styles.userSidebar}>
          <UserCard orcidUser={orcidUser} />
          <UserAccountTabs hasEdit={hasEdit} isUser={isUser} />
        </section>
        <section className={styles.userViews}>
          <Outlet />
        </section>
      </div>
    </>
  )
}

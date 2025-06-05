import React from "react"
import type { FC } from "react"
import { useMutation } from "@apollo/client"
import { WarnButton } from "../../components/warn-button/WarnButton"
import { getProfile } from "../../authentication/profile"
import { useCookies } from "react-cookie"
import type { User } from "../../types/user-types"
import styles from "./users.module.scss"
import * as Sentry from "@sentry/react"

import { SET_ADMIN_MUTATION, SET_BLOCKED_MUTATION } from "../../queries/users"

interface UserToolsProps {
  user: User
  refetchCurrentPage: () => void
}

export const UserTools: FC<UserToolsProps> = ({ user, refetchCurrentPage }) => {
  const [cookies] = useCookies()
  const adminIcon = user.admin ? "fa-check-square-o" : "fa-square-o"
  const blacklistIcon = user.blocked ? "fa-check-square-o" : "fa-square-o"

  // --- useMutation for SET_ADMIN ---
  const [setAdmin] = useMutation(SET_ADMIN_MUTATION, {
    update(cache, { data: { setAdmin: updatedUser } }) {
      cache.modify({
        id: cache.identify(updatedUser),
        fields: {
          admin() {
            return updatedUser.admin
          },
          blocked() {
            return updatedUser.blocked
          },
          modified() {
            return updatedUser.modified
          },
        },
      })
    },
    onCompleted: () => {
      refetchCurrentPage()
    },
    onError: (error) => {
      Sentry.captureException(error)
    },
  })

  // --- useMutation for SET_BLOCKED ---
  const [setBlocked] = useMutation(SET_BLOCKED_MUTATION, {
    update(cache, { data: { setBlocked: updatedUser } }) {
      cache.modify({
        id: cache.identify(updatedUser),
        fields: {
          blocked() {
            return updatedUser.blocked
          },
          admin() {
            return updatedUser.admin
          },
          modified() {
            return updatedUser.modified
          },
        },
      })
    },
    onCompleted: () => {
      refetchCurrentPage()
    },
    onError: (error) => {
      Sentry.captureException(error)
    },
  })

  if (user.id !== getProfile(cookies).sub) {
    return (
      <div className="dataset-tools-wrap-admin">
        <div className={styles.tools}>
          <div className="tool">
            <WarnButton
              message="Admin"
              icon={adminIcon}
              onConfirmedClick={async (): Promise<void> => {
                await setAdmin({
                  variables: { id: user.id, admin: !user.admin },
                })
              }}
            />
          </div>
          <div className="tool">
            <WarnButton
              message="Block"
              icon={blacklistIcon}
              onConfirmedClick={async (): Promise<void> => {
                await setBlocked({
                  variables: { id: user.id, blocked: !user.blocked },
                })
              }}
            />
          </div>
        </div>
      </div>
    )
  } else {
    return null
  }
}

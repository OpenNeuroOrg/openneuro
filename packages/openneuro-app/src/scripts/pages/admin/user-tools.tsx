import React from "react"
import type { FC, ReactElement } from "react"
import { gql } from "@apollo/client"
import { Mutation } from "@apollo/client/react/components"
import { WarnButton } from "../../components/warn-button/WarnButton"
import { getProfile } from "../../authentication/profile"
import { useCookies } from "react-cookie"
import { USER_FRAGMENT } from "./user-fragment"

interface UserToolsProps {
  user: Record<string, unknown>
  refetch: () => Record<string, unknown>
}

export const SET_ADMIN = gql`
  mutation ($id: ID!, $admin: Boolean!) {
    setAdmin(id: $id, admin: $admin) {
      ...userFields
    }
  }
  ${USER_FRAGMENT}
`

export const SET_BLOCKED = gql`
  mutation ($id: ID!, $blocked: Boolean!) {
    setBlocked(id: $id, blocked: $blocked) {
      ...userFields
    }
  }
  ${USER_FRAGMENT}
`

export const UserTools: FC<UserToolsProps> = ({ user, refetch }) => {
  const [cookies] = useCookies()
  const adminIcon = user.admin ? "fa-check-square-o" : "fa-square-o"
  const blacklistIcon = user.blocked ? "fa-check-square-o" : "fa-square-o"

  if (user.id !== getProfile(cookies).sub) {
    return (
      <div className="dataset-tools-wrap-admin">
        <div className="tools clearfix">
          <div className="tool">
            <Mutation
              mutation={SET_ADMIN}
              variables={{ id: user.id, admin: !user.admin }}
            >
              {(setAdmin): ReactElement => (
                <WarnButton
                  message="Admin"
                  icon={adminIcon}
                  onConfirmedClick={(): void => {
                    setAdmin().then(() => {
                      refetch()
                    })
                  }}
                />
              )}
            </Mutation>
          </div>
          <div className="tool">
            <Mutation
              mutation={SET_BLOCKED}
              variables={{ id: user.id, blocked: !user.blocked }}
            >
              {(setBlocked): ReactElement => (
                <WarnButton
                  message="Block"
                  icon={blacklistIcon}
                  onConfirmedClick={(): void => {
                    setBlocked().then(() => {
                      refetch()
                    })
                  }}
                />
              )}
            </Mutation>
          </div>
        </div>
      </div>
    )
  } else {
    return null
  }
}

import React from "react"
import { useCookies } from "react-cookie"
import { getProfile } from "./profile"

interface RegularUserProps {
  children?: React.ReactNode
}

/**
 * Render children if this is not an admin user
 */
export const RegularUser = ({ children }: RegularUserProps): JSX.Element => {
  const [cookies] = useCookies()
  const profile = getProfile(cookies)
  if (profile?.admin) {
    return null
  } else {
    return <>{children}</>
  }
}

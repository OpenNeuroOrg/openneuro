import React, { createContext, useState } from "react"
import { UserLoginModal } from "@openneuro/components/modal"
import loginUrls from "../authentication/loginUrls"

export const UserModalOpenCtx = createContext(null)

interface UserModalOpenProviderProps {
  children: React.ReactNode
}

export const UserModalOpenProvider: React.FC<UserModalOpenProviderProps> = ({
  children,
}) => {
  const [userModalOpen, setUserModalOpen] = useState(false)
  const toggle = (): void => {
    setUserModalOpen((prevState) => !prevState)
  }
  return (
    <UserModalOpenCtx.Provider value={{ userModalOpen, setUserModalOpen }}>
      {children}
      <UserLoginModal
        isOpen={userModalOpen}
        toggle={toggle}
        loginUrls={loginUrls}
      />
    </UserModalOpenCtx.Provider>
  )
}

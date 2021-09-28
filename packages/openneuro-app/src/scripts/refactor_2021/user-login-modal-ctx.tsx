import React, { createContext, useState, FC, ReactNode } from 'react'
import { UserLoginModal } from '@openneuro/components/modal'
import loginUrls from './authentication/loginUrls'

export const UserModalOpenCtx = createContext(null)

interface UserModalOpenProviderProps {
  children: ReactNode
}

export const UserModalOpenProvider: FC<UserModalOpenProviderProps> = ({
  children,
}) => {
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [loginOptions, setLoginOptions] = useState({
    redirect: null
  })
  const toggle = (): void => {
    setUserModalOpen(prevState => !prevState)
  }
  return (
    <UserModalOpenCtx.Provider value={{ userModalOpen, setUserModalOpen, setLoginOptions }}>
      {children}
      <UserLoginModal
        isOpen={userModalOpen}
        toggle={toggle}
        loginUrls={loginUrls}
        redirectPathParam={loginOptions.redirect}
      />
    </UserModalOpenCtx.Provider>
  )
}

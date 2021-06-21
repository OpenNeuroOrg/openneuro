import React, { createContext, useState, FC, ReactNode } from 'react'
import { Modal, UserLoginModal } from '@openneuro/components'

export const UserModalParamsCtx = createContext(null)

interface UserModalParamsProviderProps {
  children: ReactNode
}

export const UserModalParamsProvider: FC<UserModalParamsProviderProps> = ({
  children,
}) => {
  const [userModalParams, setUserModalParams] = useState(false)
  return (
    <UserModalParamsCtx.Provider
      value={{ userModalParams, setUserModalParams }}>
      {children}
      <UserLoginModal
        userModalParams={userModalParams}
        setUserModalParams={setUserModalParams}
      />
    </UserModalParamsCtx.Provider>
  )
}

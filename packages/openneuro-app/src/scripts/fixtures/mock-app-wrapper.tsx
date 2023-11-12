import React, { useState } from "react"
import { MemoryRouter } from "react-router-dom"
import { UserModalOpenCtx } from "../utils/user-login-modal-ctx"
import { MockedProvider } from "@apollo/client/testing"

// Provide the basics needed to render complex components with mocked router, apollo, etc
export const MockAppWrapper = ({ children }) => {
  const [userModalOpen, setUserModalOpen] = useState(false)
  return (
    <MemoryRouter>
      <MockedProvider>
        <UserModalOpenCtx.Provider value={{ userModalOpen, setUserModalOpen }}>
          {children}
        </UserModalOpenCtx.Provider>
      </MockedProvider>
    </MemoryRouter>
  )
}

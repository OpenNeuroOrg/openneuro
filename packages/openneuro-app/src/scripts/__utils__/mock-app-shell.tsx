import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/client/testing'
import { SearchParamsCtx } from '../search/search-params-ctx'
import { UserModalOpenCtx } from '../utils/user-login-modal-ctx'
import initialSearchParams from '../search/initial-search-params'

/**
 * Reusable shell component that provides any context required by major component trees
 */
export const MockAppShell = ({ children, route = '/' }) => (
  <MockedProvider>
    <SearchParamsCtx.Provider
      value={{
        searchParams: initialSearchParams,
      }}>
      <UserModalOpenCtx.Provider value={false}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </UserModalOpenCtx.Provider>
    </SearchParamsCtx.Provider>
  </MockedProvider>
)

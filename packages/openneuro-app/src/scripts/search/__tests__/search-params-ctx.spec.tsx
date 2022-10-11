import React from 'react'
import { render, screen } from '@testing-library/react'
import { SearchParamsProvider, SearchParamsCtx } from '../search-params-ctx'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

/**
 * Render with SearchParamsCtx state
 */
export const searchRender = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <SearchParamsCtx.Provider {...providerProps}>
      {ui}
    </SearchParamsCtx.Provider>,
    renderOptions,
  )
}

describe('SearchParamsProvider', () => {
  it('restores URL searchParams state', () => {
    const route = '/search?query={"authors"%3A["Test+Author"]}'
    const value = {}
    const wrapper = ({ children }) => (
      <MemoryRouter initialEntries={[route]}>
        <SearchParamsProvider>{children}</SearchParamsProvider>
      </MemoryRouter>
    )
    render(
      <SearchParamsCtx.Consumer>
        {value => <span>Received: {value.searchParams.authors.pop()}</span>}
      </SearchParamsCtx.Consumer>,
      { wrapper },
    )
    expect(screen.getByText(/^Received:/).textContent).toBe(
      'Received: Test Author',
    )
  })
})

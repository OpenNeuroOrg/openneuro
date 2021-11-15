import React from 'react'
import { render } from '@testing-library/react'
import { SearchParamsCtx } from '../search-params-ctx'
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

describe('SearchParamsCtx', () => {
  it('initializes with expected defaults', () => {})
})

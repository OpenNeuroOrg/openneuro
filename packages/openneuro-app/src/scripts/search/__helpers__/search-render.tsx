import React from "react"
import { SearchParamsCtx } from "../search-params-ctx"
import { render } from "@testing-library/react"

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

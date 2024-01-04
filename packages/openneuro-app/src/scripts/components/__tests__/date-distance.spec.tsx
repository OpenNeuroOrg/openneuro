import React from "react"
import { vi } from "vitest"
import { render } from "@testing-library/react"
import { DateDistance } from "../date-distance"

describe("DataTable component", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 1, 4))
  })
  afterEach(() => {
    vi.useRealTimers()
  })
  it("renders date distance components", () => {
    const date = new Date(2022, 1, 4).toISOString()
    const { asFragment } = render(<DateDistance date={date} />)
    expect(asFragment()).toMatchSnapshot()
  })
})

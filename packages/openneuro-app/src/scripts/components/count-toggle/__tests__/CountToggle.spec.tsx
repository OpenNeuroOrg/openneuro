import { vi } from "vitest"
import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { CountToggle } from "../CountToggle"

export const datasetType_available = [
  { label: "All Public", value: "All Public" },
  { label: "Following", value: "Following" },
  { label: "My Datasets", value: "My Datasets" },
  { label: "My Bookmarks", value: "My Bookmarks" },
]

describe("CountToggle component", () => {
  it("calls toggleClick on toggle", () => {
    const toggleClick = vi.fn()
    const clicked = false
    const count = 3
    render(
      <CountToggle
        label="count toggle test"
        icon="fa-thumbtack"
        toggleClick={toggleClick}
        tooltip="test tip"
        clicked={clicked}
        count={count}
      />,
    )
    fireEvent.click(screen.getByText("count toggle test"))
    expect(toggleClick).toHaveBeenCalledTimes(1)
  })
})

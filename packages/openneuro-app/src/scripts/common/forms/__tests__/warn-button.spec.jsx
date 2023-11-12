import React from "react"
import { render } from "@testing-library/react"
import WarnButton from "../warn-button"

describe("common/forms/WarnButton", () => {
  it("renders successfully", () => {
    const { asFragment } = render(<WarnButton message="A Button!" />)
    expect(asFragment()).toMatchSnapshot()
  })
  it("renders with warnings disable", () => {
    const { asFragment } = render(
      <WarnButton message="A Button!" warn={false} />,
    )
    expect(asFragment()).toMatchSnapshot()
  })
})

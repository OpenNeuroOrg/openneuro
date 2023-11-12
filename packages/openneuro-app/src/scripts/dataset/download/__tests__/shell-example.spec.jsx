import React from "react"
import { render } from "@testing-library/react"
import ShellExample from "../shell-example.jsx"

describe("dataset/download/ShellExample", () => {
  it("renders successfully", () => {
    const { asFragment } = render(<ShellExample />)
    expect(asFragment()).toMatchSnapshot()
  })
})

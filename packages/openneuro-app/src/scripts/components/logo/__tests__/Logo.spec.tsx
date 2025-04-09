import React from "react"
import { render, screen } from "@testing-library/react"
import { Logo } from "../Logo"

describe("Logo component", () => {
  it("renders dark/horizontal", async () => {
    render(<Logo />)
    expect(await screen.getByRole("img")).toBeInTheDocument()
  })
  it("renders light/horizontal", async () => {
    render(<Logo dark={false} />)
    expect(await screen.getByRole("img")).toBeInTheDocument()
  })
  it("renders dark/vertical", async () => {
    render(<Logo horizontal={false} />)
    expect(await screen.getByRole("img")).toBeInTheDocument()
  })
  it("renders light/vertical", async () => {
    render(<Logo dark={false} horizontal={false} />)
    expect(await screen.getByRole("img")).toBeInTheDocument()
  })
})

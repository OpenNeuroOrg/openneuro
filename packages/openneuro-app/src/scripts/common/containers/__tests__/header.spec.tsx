import { vi } from "vitest"
import React from "react"
import { MockAppShell } from "../../../__utils__/mock-app-shell"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { HeaderContainer } from "../header"

const navigate = vi.fn()
vi.mock("../../../config.ts")
vi.mock("../../../uploader/uploader-view.jsx", () => ({
  default: () => "mocked UploaderView",
}))
vi.mock("react-router-dom", async () => ({
  // @ts-ignore-check
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => navigate,
}))

describe("HeaderContainer component", () => {
  it("navigates prepopulated search when you use the home page search box", async () => {
    render(<HeaderContainer />, { wrapper: MockAppShell })
    const searchbox = screen.getByRole("textbox")
    const button = screen.getByLabelText("Search")
    await fireEvent.change(searchbox, { target: { value: "test argument" } })
    await fireEvent.click(button)
    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith(
        '/search?query={"keywords":["test argument"]}',
      )
    )
  })
})

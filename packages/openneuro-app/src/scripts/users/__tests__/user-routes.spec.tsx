import React from "react"
import { cleanup, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { UserRoutes } from "../user-routes"
import type { User } from "../user-routes"

const defaultUser: User = {
  id: "1",
  name: "John Doe",
  location: "Unknown",
  github: "",
  institution: "Unknown Institution",
  email: "john.doe@example.com",
  avatar: "https://dummyimage.com/200x200/000/fff",
  orcid: "0000-0000-0000-0000",
  links: [],
}

const renderWithRouter = (user: User, route: string, hasEdit: boolean) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <UserRoutes user={user} hasEdit={hasEdit} />
    </MemoryRouter>,
  )
}

describe("UserRoutes Component", () => {
  const user: User = defaultUser

  it("renders UserDatasetsView for the default route", async () => {
    renderWithRouter(user, "/", true)
    expect(screen.getByText(`${user.name}'s Datasets`)).toBeInTheDocument()
    const datasetsView = await screen.findByTestId("user-datasets-view")
    expect(datasetsView).toBeInTheDocument()
  })

  it("renders FourOFourPage for an invalid route", async () => {
    renderWithRouter(user, "/nonexistent-route", true)
    const errorMessage = await screen.findByText(
      /404: The page you are looking for does not exist./i,
    )
    expect(errorMessage).toBeInTheDocument()
  })

  it("renders UserAccountView when hasEdit is true", async () => {
    renderWithRouter(user, "/account", true)
    const accountView = await screen.findByTestId("user-account-view")
    expect(accountView).toBeInTheDocument()
  })

  it("renders UserNotificationsView when hasEdit is true", async () => {
    renderWithRouter(user, "/notifications", true)
    const notificationsView = await screen.findByTestId(
      "user-notifications-view",
    )
    expect(notificationsView).toBeInTheDocument()
  })

  it("renders FourOThreePage when hasEdit is false for restricted routes", async () => {
    const restrictedRoutes = ["/account", "/notifications"]

    for (const route of restrictedRoutes) {
      cleanup()
      renderWithRouter(user, route, false)
      const errorMessage = await screen.findByText(
        /403: You do not have access to this page, you may need to sign in./i,
      )
      expect(errorMessage).toBeInTheDocument()
    }
  })
})

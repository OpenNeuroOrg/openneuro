import React from "react"
import { cleanup, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { MockedProvider } from "@apollo/client/testing"
import { UserRoutes } from "../user-routes"
import type { User } from "../../types/user-types"
import { DATASETS_QUERY } from "../user-datasets-view"
import { vi } from "vitest"

vi.mock("../../config", () => ({
  config: {
    url: "http://localhost:8111",
    api: "http://localhost:8111/crn/",
    graphql: { uri: "/graphql" },
    auth: {
      orcid: {
        clientID: "test-orcid-client-id",
        ORCID_API_ENDPOINT: "https://orcid.org/",
      },
    },
  },
}))

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

const mocks = [
  {
    request: {
      query: DATASETS_QUERY,
      variables: { first: 25 },
    },
    result: {
      data: {
        datasets: {
          edges: [
            {
              node: {
                id: "ds001012",
                created: "2025-01-22T19:55:49.997Z",
                name: "The DBS-fMRI dataset",
                public: null,
                analytics: {
                  views: 9,
                  downloads: 0,
                },
                stars: [],
                followers: [
                  {
                    userId: "47e6a401-5edf-4022-801f-c05fffbf1d10",
                    datasetId: "ds001012",
                  },
                ],
                latestSnapshot: {
                  id: "ds001012:1.0.0",
                  size: 635,
                  created: "2025-01-22T19:55:49.997Z",
                  description: {
                    Name: "The DBS-fMRI dataset",
                    Authors: [
                      "Jianxun Ren",
                      " Changqing Jiang",
                      "Wei Zhang",
                      "Louisa Dahmani",
                      "Lunhao Shen",
                      "Feng Zhang",
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
  },
]

const renderWithRouter = (user: User, route: string, hasEdit: boolean) => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter initialEntries={[route]}>
        <UserRoutes user={user} hasEdit={hasEdit} />
      </MemoryRouter>
    </MockedProvider>,
  )
}

describe("UserRoutes Component", () => {
  const user: User = defaultUser

  it("renders UserDatasetsView for the default route", async () => {
    renderWithRouter(user, "/", true)
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

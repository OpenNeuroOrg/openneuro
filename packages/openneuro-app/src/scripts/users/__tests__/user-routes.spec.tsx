import { vi } from "vitest"
import React from "react"
import { cleanup, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { MockedProvider } from "@apollo/client/testing"

// Component under test
import { UserRoutes } from "../user-routes"

// Types and Queries
import type { User } from "../../types/user-types"
import { ADVANCED_SEARCH_DATASETS_QUERY, GET_USER } from "../../queries/user"

vi.mock("./user-container", () => {
  return {
    UserAccountContainer: vi.fn((props) => (
      <div data-testid="mock-user-account-container">
        Mocked UserAccountContainer
        {props.children}
        <p>Container ORCID: {props.orcidUser?.orcid}</p>
        <p>Container Has Edit: {props.hasEdit ? "true" : "false"}</p>
        <p>Container Is User: {props.isUser ? "true" : "false"}</p>
      </div>
    )),
  }
})

vi.mock("./user-account-view", () => ({
  UserAccountView: vi.fn((props) => (
    <div data-testid="user-account-view">
      Mocked UserAccountView
      <p>View ORCID: {props.orcidUser?.orcid}</p>
    </div>
  )),
}))

vi.mock("./user-notifications-view", () => ({
  UserNotificationsView: vi.fn((props) => (
    <div data-testid="user-notifications-view">
      Mocked UserNotificationsView
      {props.children}
      <p>Notifications ORCID: {props.orcidUser?.orcid}</p>
    </div>
  )),
}))

vi.mock("./user-datasets-view", () => ({
  UserDatasetsView: vi.fn((props) => (
    <div data-testid="user-datasets-view">
      Mocked UserDatasetsView
      <p>Datasets ORCID: {props.orcidUser?.orcid}</p>
      <p>Datasets Has Edit: {props.hasEdit ? "true" : "false"}</p>
    </div>
  )),
}))

vi.mock("../errors/404page", () => ({
  default: vi.fn(() => (
    <div data-testid="404-page">
      404: The page you are looking for does not exist.
    </div>
  )),
}))

vi.mock("../errors/403page", () => ({
  default: vi.fn(() => (
    <div data-testid="403-page">
      403: You do not have access to this page, you may need to sign in.
    </div>
  )),
}))

vi.mock("./user-notifications-tab-content", () => ({
  UnreadNotifications: vi.fn(() => (
    <div data-testid="unread-notifications">Unread Notifications</div>
  )),
  SavedNotifications: vi.fn(() => (
    <div data-testid="saved-notifications">Saved Notifications</div>
  )),
  ArchivedNotifications: vi.fn(() => (
    <div data-testid="archived-notifications">Archived Notifications</div>
  )),
}))

const defaultUser: User = {
  id: "1",
  name: "John Doe",
  location: "Unknown",
  github: "",
  institution: "Unknown Institution",
  email: "john.doe@example.com",
  avatar: "https://dummyimage.com/200x200/000/fff",
  orcid: "0000-0000-0000-0000", // Ensure ORCID is present for mocks
  links: [],
}

const mocks = [
  {
    request: {
      query: ADVANCED_SEARCH_DATASETS_QUERY,
      variables: {
        first: 26,
        query: {
          bool: {
            filter: [
              {
                terms: {
                  "permissions.userPermissions.user.id": [defaultUser.id],
                },
              },
            ],
            must: [{ match_all: {} }],
          },
        },
        sortBy: null,
        cursor: null,
        allDatasets: true,
        datasetStatus: undefined,
      },
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
  {
    request: {
      query: GET_USER,
      variables: { id: defaultUser.orcid },
    },
    result: {
      data: {
        user: defaultUser,
      },
    },
  },
]
const renderWithRouter = (
  orcidUser: User,
  route: string,
  hasEdit: boolean,
  isUser: boolean,
) => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter initialEntries={[route]}>
        <UserRoutes orcidUser={orcidUser} hasEdit={hasEdit} isUser={isUser} />
      </MemoryRouter>
    </MockedProvider>,
  )
}

describe("UserRoutes Component", () => {
  const userToPass: User = defaultUser

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
    vi.resetAllMocks()
  })

  it("renders UserDatasetsView for the default route", async () => {
    renderWithRouter(userToPass, "/", true, true)
    // Expect the default to be the datasets view
    const datasetsView = await screen.findByTestId("user-datasets-view")
    expect(datasetsView).toBeInTheDocument()
    expect(screen.getByText(userToPass.orcid)).toBeInTheDocument()
  })

  it("renders FourOFourPage for an invalid route", async () => {
    renderWithRouter(userToPass, "/nonexistent-route", true, true)
    // Expect the mocked 404 page
    expect(
      screen.getByText(/404: The page you are looking for does not exist./i),
    ).toBeInTheDocument()
  })

  it("renders UserAccountView when hasEdit is true", async () => {
    renderWithRouter(userToPass, "/account", true, true)
    // Expect the mocked account view
    const accountView = await screen.findByTestId("user-account-view")
    expect(accountView).toBeInTheDocument()
  })

  it("renders UserNotificationsView when hasEdit is true", async () => {
    renderWithRouter(userToPass, "/notifications", true, true)
    // Expect the mocked notifications view
    const notificationsView = await screen.findByTestId(
      "user-notifications-view",
    )
    expect(notificationsView).toBeInTheDocument()
  })

  it("renders SavedNotifications within UserNotificationsView", async () => {
    renderWithRouter(userToPass, "/notifications/saved", true, true)
    const notificationsView = await screen.findByTestId(
      "user-notifications-view",
    )
    expect(notificationsView).toBeInTheDocument()
    expect(screen.getByText("Saved Notification Example")).toBeInTheDocument()
  })

  it("renders ArchivedNotifications within UserNotificationsView", async () => {
    renderWithRouter(userToPass, "/notifications/archived", true, true)
    const notificationsView = await screen.findByTestId(
      "user-notifications-view",
    )
    expect(notificationsView).toBeInTheDocument()
    expect(screen.getByText("Archived Notification Example"))
      .toBeInTheDocument()
  })

  it("renders 404 for unknown notification sub-route", async () => {
    renderWithRouter(userToPass, "/notifications/nonexistent", true, true)
    expect(
      screen.getByText(/404: The page you are looking for does not exist./i),
    ).toBeInTheDocument()
  })

  it("renders FourOThreePage when hasEdit is false for restricted routes", async () => {
    const restrictedRoutes = ["/account", "/notifications"]

    for (const route of restrictedRoutes) {
      renderWithRouter(userToPass, route, false, true)
      expect(
        screen.getByText(
          /403: You do not have access to this page, you may need to sign in./i,
        ),
      ).toBeInTheDocument()
      cleanup()
    }
  })
})

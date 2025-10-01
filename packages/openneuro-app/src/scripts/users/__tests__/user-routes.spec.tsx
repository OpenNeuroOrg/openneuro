import React from "react"
import { cleanup, render, screen } from "@testing-library/react"
import { vi } from "vitest"
import { MemoryRouter, Outlet } from "react-router-dom"
import { MockedProvider } from "@apollo/client/testing"
import { UserRoutes } from "../user-routes"
import type { Event, MappedNotification } from "../../types/event-types"
import type { OutletContextType, User } from "../../types/user-types"
import { ADVANCED_SEARCH_DATASETS_QUERY, GET_USER } from "../../queries/user"

// A minimal test user object, replacing the need for an external "testUser" import
const testUser = {
  id: "1",
  name: "John Doe",
  location: "Unknown",
  github: "",
  institution: "Unknown Institution",
  email: "john.doe@example.com",
  avatar: "https://dummyimage.com/200x200/000/fff",
  orcid: "0000-0000-0000-0000",
  links: [],
  notifications: [],
}

const setupUserRoutes = (
  orcidUser: User,
  route: string,
  hasEdit: boolean,
  isUser: boolean,
) => {
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
                    "permissions.userPermissions.user.id": [orcidUser.id],
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
            edges: [],
          },
        },
      },
    },
    {
      request: {
        query: GET_USER,
        variables: { userId: orcidUser.id },
      },
      result: {
        data: {
          user: orcidUser,
        },
      },
    },
  ]

  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter initialEntries={[route]}>
        <UserRoutes orcidUser={orcidUser} hasEdit={hasEdit} isUser={isUser} />
      </MemoryRouter>
    </MockedProvider>,
  )
}

// --- Component Mocks ---

vi.mock("../../config", () => ({
  config: {
    url: "https://test-server.com",
    api: "https://test-server.com/crn/",
    graphql: {
      api_url: "https://test-server.com/crn/graphql",
      subscription_url: "wss://test-server.com/crn/graphql",
    },
  },
}))

vi.mock("../username", () => ({
  default: vi.fn((props) => (
    <span data-testid="mock-username">{props.children}</span>
  )),
}))

vi.mock("./user-container", () => {
  return {
    UserAccountContainer: vi.fn((props) => (
      <div data-testid="mock-user-account-container">
        {props.children}
      </div>
    )),
  }
})

vi.mock("./user-account-view", () => ({
  UserAccountView: vi.fn(() => (
    <div data-testid="user-account-view">Mocked UserAccountView</div>
  )),
}))

vi.mock("./user-datasets-view", () => ({
  UserDatasetsView: vi.fn(() => (
    <div data-testid="user-datasets-view">Mocked UserDatasetsView</div>
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

// Mock the notification tab content
vi.mock("./user-notifications-tab-content", () => ({
  UnreadNotifications: vi.fn(() => (
    <div data-testid="unread-notifications">Unread Notifications Content</div>
  )),
  SavedNotifications: vi.fn(() => (
    <div data-testid="saved-notifications">Saved Notifications Content</div>
  )),
  ArchivedNotifications: vi.fn(() => (
    <div data-testid="archived-notifications">
      Archived Notifications Content
    </div>
  )),
}))

// Mock the UserNotificationsView
vi.mock("./user-notifications-view", () => {
  const baseDatasetEvent: Event = {
    id: "1",
    timestamp: "2023-01-01T12:00:00Z",
    event: { type: "published", message: "A dataset has been published." },
    // The status field is nested here now
    notificationStatus: { status: "UNREAD" },
  }

  const mockNotifications: MappedNotification[] = [
    {
      id: "1",
      title: "Dataset Published",
      content: "Dataset 'My Awesome Dataset' has been published.",
      status: "unread",
      type: "general",
      originalNotification: {
        ...baseDatasetEvent,
        id: "1",
        notificationStatus: { status: "UNREAD" },
      },
    },
    {
      id: "2",
      title: "Dataset Saved",
      content: "Dataset 'Another Dataset' has been saved.",
      status: "saved",
      type: "general",
      originalNotification: {
        ...baseDatasetEvent,
        id: "2",
        notificationStatus: { status: "SAVED" },
      },
    },
    {
      id: "3",
      title: "Dataset Archived",
      content: "Dataset 'Old Dataset' has been archived.",
      status: "archived",
      type: "general",
      originalNotification: {
        ...baseDatasetEvent,
        id: "3",
        notificationStatus: { status: "ARCHIVED" },
      },
    },
  ]

  const handleUpdateNotification = vi.fn()

  return {
    UserNotificationsView: vi.fn(() => (
      <div data-testid="user-notifications-view">
        <div data-testid="mock-outlet-context-provider">
          <Outlet
            context={{
              notifications: mockNotifications,
              handleUpdateNotification,
            } as OutletContextType}
          />
        </div>
      </div>
    )),
  }
})

describe("UserRoutes Component", () => {
  const userToPass: User = testUser

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
    vi.resetAllMocks()
  })

  it("renders UserDatasetsView for the default route", async () => {
    setupUserRoutes(userToPass, "/", true, true)
    const datasetsView = await screen.findByTestId("user-datasets-view")
    expect(datasetsView).toBeInTheDocument()
  })

  it("renders 404 for an invalid route", async () => {
    setupUserRoutes(userToPass, "/nonexistent-route", true, true)
    expect(screen.getByTestId("404-page")).toBeInTheDocument()
  })

  it("renders UserAccountView when hasEdit is true", async () => {
    setupUserRoutes(userToPass, "/account", true, true)
    const accountView = await screen.findByTestId("user-account-view")
    expect(accountView).toBeInTheDocument()
  })

  it("renders UserNotificationsView for the default notifications route", async () => {
    setupUserRoutes(userToPass, "/notifications", true, true)
    const notificationsView = await screen.findByTestId(
      "user-notifications-view",
    )
    expect(notificationsView).toBeInTheDocument()
  })

  it("renders UnreadNotifications within UserNotificationsView for the index route", async () => {
    setupUserRoutes(userToPass, "/notifications", true, true)
    const notificationsView = await screen.findByTestId(
      "user-notifications-view",
    )
    expect(notificationsView).toBeInTheDocument()
    const unreadNotifications = await screen.findByTestId(
      "unread-notifications",
    )
    expect(unreadNotifications).toBeInTheDocument()
  })

  it("renders SavedNotifications within UserNotificationsView", async () => {
    setupUserRoutes(userToPass, "/notifications/saved", true, true)
    const notificationsView = await screen.findByTestId(
      "user-notifications-view",
    )
    expect(notificationsView).toBeInTheDocument()
    const savedNotifications = await screen.findByTestId("saved-notifications")
    expect(savedNotifications).toBeInTheDocument()
  })

  it("renders ArchivedNotifications within UserNotificationsView", async () => {
    setupUserRoutes(userToPass, "/notifications/archived", true, true)
    const notificationsView = await screen.findByTestId(
      "user-notifications-view",
    )
    expect(notificationsView).toBeInTheDocument()
    const archivedNotifications = await screen.findByTestId(
      "archived-notifications",
    )
    expect(archivedNotifications).toBeInTheDocument()
  })

  it("renders 404 for unknown notification sub-route", async () => {
    setupUserRoutes(userToPass, "/notifications/nonexistent", true, true)
    expect(await screen.findByTestId("404-page")).toBeInTheDocument()
  })

  it("renders FourOThreePage for restricted route /account when hasEdit is false", async () => {
    setupUserRoutes(userToPass, "/account", false, true)
    expect(await screen.findByTestId("403-page")).toBeInTheDocument()
  })

  it("renders FourOThreePage for restricted route /notifications when hasEdit is false", async () => {
    setupUserRoutes(userToPass, "/notifications", false, true)
    expect(await screen.findByTestId("403-page")).toBeInTheDocument()
  })
})

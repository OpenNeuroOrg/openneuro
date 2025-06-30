import React from "react"
import { vi } from "vitest"
import { act, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { MockedProvider } from "@apollo/client/testing"
import DraftContainer from "../draft-container"
import type { DraftContainerProps } from "../draft-container"
import { UserModalOpenProvider } from "../../utils/user-login-modal-ctx"
import { Cookies, CookiesProvider } from "react-cookie"
import type * as UserQueriesModule from "../../queries/user"

vi.mock("../../config.ts")

// admin: false
const mockUser =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6ZmFsc2UsInN1YiI6IjcxZGRiMjRjLTczZjgtNDgzYS1iODVjLTU4ZTY1ZmQwN2YyYiIsImV4cCI6MzM5MTg5Nzg3MywiaWF0IjoxNzUwODc3NDkwfQ.vV66iD3RL_3O9Ofa0BazVYesGLengw8qu-MrneKoJOM"

const mockDataset = {
  id: "ds000001",
  created: "2023-01-01T00:00:00.000Z",
  draft: {
    id: "ds000001",
    head: "dce4b7b6653bcde9bdb7226a7c2b9499e77f2724",
    created: "2023-01-01T00:00:00.000Z",
    modified: "2023-01-01T00:00:00.000Z",
    description: {
      Name: "Test Dataset Name",
    },
    summary: {
      totalFiles: 10,
      size: 1234567,
      modalities: ["T1w", "bold"],
      sessions: [],
      tasks: [],
      subjects: [],
    },
    readme: "This is a test dataset readme.",
    contributors: [
      {
        name: "Author One",
        firstname: "Author",
        lastname: "One",
        id: "0000-0001-2345-6789",
      },
      { name: "Author Two", firstname: "Author", lastname: "Two", id: null }, // Example with no ORCID
    ],
  },
  snapshots: [],
  derivatives: [],
  followers: [],
  stars: [],
  public: true,
  permissions: {
    userPermissions: [],
  },
  analytics: {
    views: 100,
    downloads: 10,
  },
  comments: [],
  uploader: {
    name: "Test User",
    orcid: "1234-5678-9012-3456",
  },
}

const renderComponent = (
  props: DraftContainerProps,
  mocks = [],
  token = mockUser,
) => {
  // Mock the login state
  const cookieObject = new Cookies()
  cookieObject.set("accessToken", token)
  return render(
    <MemoryRouter>
      <UserModalOpenProvider>
        <MockedProvider mocks={mocks} addTypename={false}>
          <CookiesProvider cookies={cookieObject}>
            <DraftContainer {...props} />
          </CookiesProvider>
        </MockedProvider>
      </UserModalOpenProvider>
    </MemoryRouter>,
  )
}

describe("DraftContainer", () => {
  it("renders dataset name and authors", async () => {
    vi.mock("../../queries/user", async (importOriginal) => {
      const actual = await importOriginal<typeof UserQueriesModule>()
      return {
        ...actual,
        useUser: vi.fn((userId) => {
          if (userId === "0000-0001-2345-6789") {
            return {
              user: { id: userId, name: "Author One", orcid: userId },
              loading: false,
              error: undefined,
            }
          }
          return { user: null, loading: false, error: undefined }
        }),
      }
    })

    renderComponent({ dataset: mockDataset })
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(
      /Test Dataset Name/,
    )
    expect(await screen.findByText(/Author One/)).toBeInTheDocument()
    expect(await screen.findByText(/Author Two/)).toBeInTheDocument()

    const authorOneProfileLink = screen.getByRole("link", {
      name: "Author One",
    })
    expect(authorOneProfileLink).toBeInTheDocument()
    expect(authorOneProfileLink).toHaveAttribute(
      "href",
      "/user/0000-0001-2345-6789",
    )

    const orcidExternalLink = screen.getByLabelText(
      /ORCID profile for Author One/i,
    )
    expect(orcidExternalLink).toBeInTheDocument()
    expect(orcidExternalLink).toHaveAttribute(
      "href",
      expect.stringContaining("orcid.org/0000-0001-2345-6789"),
    )
    expect(orcidExternalLink).toHaveAttribute("target", "_blank")
    expect(orcidExternalLink).toHaveAttribute("rel", "noopener noreferrer")

    const authorTwoProfileLink = screen.queryByRole("link", {
      name: /Author Two/i,
    })
    expect(authorTwoProfileLink).not.toBeInTheDocument()
  })

  describe("dataset name field", () => {
    it("is editable for users with permissions", async () => {
      const datasetWithPermissions = {
        ...mockDataset,
        permissions: {
          userPermissions: [
            {
              user: {
                id: "71ddb24c-73f8-483a-b85c-58e65fd07f2b",
                email: "test@example.com",
                orcid: "0000-0003-4848-1153",
                name: "Test User",
              },
              level: "admin",
            },
          ],
        },
      }
      const user = userEvent.setup()
      renderComponent({ dataset: datasetWithPermissions })
      const h1 = await screen.findByRole("heading", { level: 1 })
      const editButton = await within(h1).findByRole("button", {
        name: /edit/i,
      })
      await act(async () => {
        await user.click(editButton)
      })
      const textbox = await within(h1).findByRole("textbox")
      expect(textbox).toHaveValue(mockDataset.draft.description.Name)
    })

    it("is not editable for users without permissions", async () => {
      renderComponent({ dataset: mockDataset })
      const h1 = await screen.findByRole("heading", { level: 1 })
      expect(
        within(h1).queryByRole("button", { name: /edit/i }),
      ).not.toBeInTheDocument()
    })
  })

  it("renders the readme content if available", async () => {
    renderComponent({ dataset: mockDataset })
    expect(
      await screen.findByText("This is a test dataset readme."),
    ).toBeInTheDocument()
  })
})

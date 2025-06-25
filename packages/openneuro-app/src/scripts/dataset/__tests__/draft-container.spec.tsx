import React from "react"
import { vi } from "vitest"
import { act, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { MockedProvider } from "@apollo/client/testing"
import DraftContainer, { DraftContainerProps } from "../draft-container"
import { UserModalOpenProvider } from "../../utils/user-login-modal-ctx"
import { Cookies, CookiesProvider } from "react-cookie"

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
      Authors: ["Author One", "Author Two"],
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
    renderComponent({ dataset: mockDataset })
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(
      /Test Dataset Name/,
    )
    expect(await screen.findByText(/Author One/)).toBeInTheDocument()
    expect(await screen.findByText(/Author Two/)).toBeInTheDocument()
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

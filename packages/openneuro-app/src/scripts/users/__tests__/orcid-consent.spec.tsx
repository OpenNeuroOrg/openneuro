import { vi } from "vitest"
import React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { MockedProvider } from "@apollo/client/testing"
import type { MockedResponse } from "@apollo/client/testing"
// Component to test
import {
  OrcidConsentForm,
  type OrcidConsentFormProps,
} from "../components/orcid-consent-form"
// Mocked dependencies
import { GET_USER, UPDATE_USER } from "../../queries/user" // Import actual queries

// Mock Button component
vi.mock("../../components/button/Button", () => ({
  Button: vi.fn(({ label, onClick, disabled, primary, size }) => (
    <button
      data-testid="mock-save-button"
      onClick={onClick}
      disabled={disabled}
      className={`${primary ? "primary" : ""} ${size}`}
    >
      {label}
    </button>
  )),
}))

// Mock RadioGroup component
vi.mock("../../components/radio/RadioGroup", () => ({
  RadioGroup: vi.fn((
    { name, radioArr, selected, setSelected, additionalText },
  ) => (
    <div data-testid={`mock-radio-group-${name}`}>
      {radioArr.map((item) => (
        <label key={item.value}>
          <input
            type="radio"
            name={name}
            value={item.value}
            checked={selected === item.value}
            onChange={(e) => setSelected(e.target.value)}
            data-testid={`radio-${item.value}`}
          />
          {item.label}
        </label>
      ))}
      {additionalText && (
        <p data-testid="radio-additional-text">{additionalText}</p>
      )}
    </div>
  )),
}))

describe("OrcidConsentForm", () => {
  const mockUserId = "test-user-id-123"
  const mockOnConsentUpdated = vi.fn()
  const mockConsoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {})

  // Mock Apollo Client's useMutation for UPDATE_USER
  const mockUpdateUserMutation = {
    request: {
      query: UPDATE_USER,
      variables: { id: mockUserId, orcidConsent: true },
    },
    result: {
      data: {
        updateUser: {
          id: mockUserId,
          location: null,
          links: [],
          institution: null,
          orcidConsent: true,
          __typename: "User",
        },
      },
    },
  }

  const mockUpdateUserMutationFalse = {
    request: {
      query: UPDATE_USER,
      variables: { id: mockUserId, orcidConsent: false },
    },
    result: {
      data: {
        updateUser: {
          id: mockUserId,
          location: null,
          links: [],
          institution: null,
          orcidConsent: false,
          __typename: "User",
        },
      },
    },
  }

  // Mock GET_USER for refetchQueries
  const mockGetUserQueryTrue = {
    request: {
      query: GET_USER,
      variables: { userId: mockUserId },
    },
    result: {
      data: {
        user: {
          id: mockUserId,
          name: "Test User",
          email: "test@example.com",
          orcidConsent: true,
          __typename: "User",
        },
      },
    },
  }
  const mockGetUserQueryFalse = {
    request: {
      query: GET_USER,
      variables: { userId: mockUserId },
    },
    result: {
      data: {
        user: {
          id: mockUserId,
          name: "Test User",
          email: "test@example.com",
          orcidConsent: false,
          __typename: "User",
        },
      },
    },
  }
  const mockGetUserQueryNull = {
    request: {
      query: GET_USER,
      variables: { userId: mockUserId },
    },
    result: {
      data: {
        user: {
          id: mockUserId,
          name: "Test User",
          email: "test@example.com",
          orcidConsent: null, // Initial null state
          __typename: "User", // Add __typename
        },
      },
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockConsoleWarn.mockClear()
  })

  afterAll(() => {
    mockConsoleWarn.mockRestore()
  })

  const renderComponent = (
    props: Partial<OrcidConsentFormProps> = {},
    mocks: MockedResponse[] = [],
  ) => {
    const defaultProps: OrcidConsentFormProps = {
      userId: mockUserId,
      initialOrcidConsent: null,
      onConsentUpdated: mockOnConsentUpdated,
    }
    // Combine component-specific mocks with any test-specific mocks
    const combinedMocks = [
      mockUpdateUserMutation,
      mockUpdateUserMutationFalse,
      mockGetUserQueryTrue,
      mockGetUserQueryFalse,
      mockGetUserQueryNull, // Include this for initial states
      ...mocks, // Allow test-specific mocks to be passed
    ]

    return render(
      <MockedProvider mocks={combinedMocks} addTypename={false}>
        <OrcidConsentForm {...defaultProps} {...props} />
      </MockedProvider>,
    )
  }

  it("renders correctly with initial null consent and hides save button", () => {
    renderComponent({ initialOrcidConsent: null })
    expect(screen.getByTestId("mock-radio-group-orcidConsent-modal"))
      .toBeInTheDocument()
    expect(screen.queryByTestId("mock-save-button")).not.toBeInTheDocument()
    expect(screen.getByTestId("radio-true")).not.toBeChecked()
    expect(screen.getByTestId("radio-false")).not.toBeChecked()
  })

  it("shows the save button when a radio option is selected (from initial null)", async () => {
    renderComponent({ initialOrcidConsent: null })
    const radioConsent = screen.getByTestId("radio-true")
    fireEvent.click(radioConsent)

    await waitFor(() => {
      const saveButton = screen.getByTestId("mock-save-button")
      expect(saveButton).toBeInTheDocument()
      expect(saveButton).not.toBeDisabled()
      expect(saveButton).toHaveTextContent("Save Consent")
      expect(screen.getByTestId("radio-true")).toBeChecked() // Verify selection
    })
  })

  it("after save button clicked, the new query (simulated prop update) reflects the selected consent", async () => {
    // Scenario 1: Change from initial `false` to `true`
    // Start with initialOrcidConsent: false
    const { rerender } = renderComponent({ initialOrcidConsent: false })
    // Initial state check
    expect(screen.getByTestId("radio-false")).toBeChecked()
    expect(screen.queryByTestId("mock-save-button")).not.toBeInTheDocument()
    // User selects "I consent" (true)
    fireEvent.click(screen.getByTestId("radio-true"))
    // Save button should appear now
    const saveButton = await screen.findByTestId("mock-save-button")
    expect(saveButton).toBeInTheDocument()
    // Click save
    fireEvent.click(saveButton)
    // Wait for mutation to complete and onConsentUpdated callback to be called
    await waitFor(() => {
      expect(mockOnConsentUpdated).toHaveBeenCalledWith(true)
    })

    rerender(
      <MockedProvider mocks={[mockGetUserQueryTrue]} addTypename={false}>
        <OrcidConsentForm
          userId={mockUserId} // Explicitly pass userId
          initialOrcidConsent={true} // New prop value from refetch
          onConsentUpdated={mockOnConsentUpdated}
        />
      </MockedProvider>,
    )
    // Assert the UI reflects the new `true` state from the prop
    await waitFor(() => {
      expect(screen.getByTestId("radio-true")).toBeChecked()
      expect(screen.getByTestId("radio-false")).not.toBeChecked()
      expect(screen.queryByTestId("mock-save-button")).not.toBeInTheDocument()
    })

    // Scenario 2: Change from initial `true` to `false`
    mockOnConsentUpdated.mockClear()
    // Reset component to initial `true`
    rerender(
      <MockedProvider mocks={[mockGetUserQueryFalse]} addTypename={false}>
        <OrcidConsentForm
          userId={mockUserId} // Explicitly pass userId
          initialOrcidConsent={true} // New prop value from refetch
          onConsentUpdated={mockOnConsentUpdated}
        />
      </MockedProvider>,
    )

    // Initial state check for second scenario
    await waitFor(() => {
      expect(screen.getByTestId("radio-true")).toBeChecked()
      expect(screen.queryByTestId("mock-save-button")).not.toBeInTheDocument()
    })

    // User selects "I DO NOT consent" (false)
    fireEvent.click(screen.getByTestId("radio-false"))
    // Save button should appear
    const saveButtonFalse = await screen.findByTestId("mock-save-button")
    expect(saveButtonFalse).toBeInTheDocument()
    // Click save
    fireEvent.click(saveButtonFalse)
    // Wait for mutation to complete and onConsentUpdated callback to be called
    await waitFor(() => {
      expect(mockOnConsentUpdated).toHaveBeenCalledWith(false)
    })
    // Simulate the parent component re-rendering with the updated prop (false)
    rerender(
      <MockedProvider mocks={[mockGetUserQueryFalse]} addTypename={false}>
        <OrcidConsentForm
          userId={mockUserId} // Explicitly pass userId
          initialOrcidConsent={false} // New prop value from refetch
          onConsentUpdated={mockOnConsentUpdated}
        />
      </MockedProvider>,
    )
    // Assert the UI reflects the new `false` state from the prop
    await waitFor(() => {
      expect(screen.getByTestId("radio-false")).toBeChecked()
      expect(screen.getByTestId("radio-true")).not.toBeChecked()
      expect(screen.queryByTestId("mock-save-button")).not.toBeInTheDocument() // Button hidden
    })
  })

  it("does not show the save button if no consent option is selected initially", () => {
    renderComponent({ initialOrcidConsent: null })
    expect(screen.queryByTestId("mock-save-button")).not.toBeInTheDocument()
    expect(screen.getByTestId("radio-true")).not.toBeChecked()
    expect(screen.getByTestId("radio-false")).not.toBeChecked()
  })
})

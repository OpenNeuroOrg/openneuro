import React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { MockedProvider } from "@apollo/client/testing"
import {
  UPDATE_ORCID_PERMISSIONS,
  UPDATE_PERMISSIONS,
  UpdateDatasetPermissions,
} from "../update-permissions"

import { isValidOrcid } from "../../../utils/validationUtils.ts";

function permissionMocksFactory(
  updatePermissionsCalled,
  updateOrcidPermissionsCalled,
) {
  return [
    {
      request: {
        query: UPDATE_PERMISSIONS,

        variables: {
          datasetId: "ds000005",
          userEmail: "test@example.com",
          level: "ro",
        },
      },
      newData: updatePermissionsCalled,
    },
    {
      request: {
        query: UPDATE_ORCID_PERMISSIONS,

        variables: {
          datasetId: "ds000005",
          userOrcid: "0000-0002-1694-233X",
          level: "ro",
        },
      },
      newData: updateOrcidPermissionsCalled,
    },
  ]
}

describe("UpdateDatasetPermissions mutation", () => {
  it("renders with default props", () => {
    const { asFragment } = render(
      <MockedProvider>
        <UpdateDatasetPermissions />
      </MockedProvider>,
    )
    expect(asFragment()).toMatchSnapshot()
  })
  it("calls UPDATE_PERMISSIONS when clicked with an email address", async () => {
    const updatePermissionsCalled = vi.fn()
    const updateOrcidPermissionsCalled = vi.fn()
    const mocks = permissionMocksFactory(
      updatePermissionsCalled,
      updateOrcidPermissionsCalled,
    )
    const done = vi.fn()
    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UpdateDatasetPermissions
          datasetId="ds000005"
          userIdentifier="test@example.com"
          metadata="ro"
          done={done}
        />
      </MockedProvider>,
    )
    const fragment = asFragment()
    expect(fragment).toMatchSnapshot()
    // Try clicking the button and make sure the right mutation runs
    const button = screen.getByRole("button")
    await fireEvent.click(button)
    // Make sure it ran at all
    await waitFor(() => expect(done).toHaveBeenCalled())
    // Verify the expected query ran
    await waitFor(() => expect(updatePermissionsCalled).toHaveBeenCalled())
    await waitFor(() =>
      expect(updateOrcidPermissionsCalled).not.toHaveBeenCalled()
    )
  })
  it("calls UPDATE_ORCID_PERMISSIONS when clicked with an ORCID", async () => {
    const updatePermissionsCalled = vi.fn()
    const updateOrcidPermissionsCalled = vi.fn()
    const mocks = permissionMocksFactory(
      updatePermissionsCalled,
      updateOrcidPermissionsCalled,
    )
    const done = vi.fn()
    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UpdateDatasetPermissions
          datasetId="ds000005"
          userIdentifier="0000-0002-1694-233X"
          metadata="ro"
          done={done}
        />
      </MockedProvider>,
    )
    const fragment = asFragment()
    expect(fragment).toMatchSnapshot()
    // Try clicking the button and make sure the right mutation runs
    const button = screen.getByRole("button")
    await fireEvent.click(button)
    // Make sure it ran at all
    await waitFor(() => expect(done).toHaveBeenCalled())
    // Verify the expected query ran
    await waitFor(() => expect(updatePermissionsCalled).not.toHaveBeenCalled())
    await waitFor(() => expect(updateOrcidPermissionsCalled).toHaveBeenCalled())
  })
  describe("isValidOrcid", () => {
    it("matches typical ORCID strings", () => {
      expect(isValidOrcid("0000-0001-2345-678")).toBe(false)
      expect(isValidOrcid("0000-0001-2345-678f")).toBe(false)
      expect(isValidOrcid("19818c4d-1e60-4480-a317-6fcc1c1a88c6")).toBe(false)
      expect(isValidOrcid("0000000123456789")).toBe(false)
      // Check for a correct value
      expect(isValidOrcid("0000-0001-2345-6789")).toBe(true)
      // Test with the X checksum value
      expect(isValidOrcid("0000-0002-1694-233X")).toBe(true)
    })
  })
})

import React from "react"
import { render } from "@testing-library/react"
import { MockedProvider } from "@apollo/client/testing"
import { isValidOrcid, UpdateDatasetPermissions } from "../update-permissions"

describe("UpdateDatasetPermissions mutation", () => {
  it("renders with default props", () => {
    const { asFragment } = render(
      <MockedProvider>
        <UpdateDatasetPermissions />
      </MockedProvider>,
    )
    expect(asFragment()).toMatchSnapshot()
  })
  it("renders with typical props", () => {
    const { asFragment } = render(
      <MockedProvider>
        <UpdateDatasetPermissions
          datasetId="ds000005"
          userEmail="test@example.com"
          access="ro"
          done={vi.fn()}
        />
      </MockedProvider>,
    )
    expect(asFragment()).toMatchSnapshot()
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

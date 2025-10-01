import { cloneContributor, CONTRIBUTOR_TYPES } from "../contributor-utils"
import type { Contributor } from "../../types/datacite"

describe("contributor-utils", () => {
  it("clones a contributor deeply", () => {
    const contributor: Contributor = {
      name: "Jane Doe",
      givenName: "Jane",
      familyName: "Doe",
      orcid: "0000-0000-0000-0000",
      contributorType: "Researcher",
      order: 1,
    }

    const cloned = cloneContributor(contributor)
    expect(cloned).toEqual(contributor)
    expect(cloned).not.toBe(contributor)
  })

  it("includes Researcher as a valid contributor type", () => {
    expect(CONTRIBUTOR_TYPES).toContain("Researcher")
  })

  it("contains at least one contributor type", () => {
    expect(CONTRIBUTOR_TYPES.length).toBeGreaterThan(0)
  })
})

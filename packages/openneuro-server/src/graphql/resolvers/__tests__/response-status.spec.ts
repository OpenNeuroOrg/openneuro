import { describe, expect, it } from "vitest"
import { toDbStatus, toGraphqlStatus } from "../response-status"

describe("toGraphqlStatus", () => {
  it("maps lowercase DB values to uppercase SDL enum values", () => {
    expect(toGraphqlStatus("pending")).toBe("PENDING")
    expect(toGraphqlStatus("accepted")).toBe("ACCEPTED")
    expect(toGraphqlStatus("denied")).toBe("DENIED")
  })

  it("passes null through unchanged", () => {
    expect(toGraphqlStatus(null)).toBeNull()
  })

  it("passes undefined through as null", () => {
    expect(toGraphqlStatus(undefined)).toBeNull()
  })

  it("throws on an unrecognized DB value", () => {
    expect(() => toGraphqlStatus("bogus" as never)).toThrow(
      /unrecognized/i,
    )
  })
})

describe("toDbStatus", () => {
  it("maps uppercase SDL enum values to lowercase DB values", () => {
    expect(toDbStatus("PENDING")).toBe("pending")
    expect(toDbStatus("ACCEPTED")).toBe("accepted")
    expect(toDbStatus("DENIED")).toBe("denied")
  })

  it("throws on an unrecognized SDL value", () => {
    expect(() => toDbStatus("bogus" as never)).toThrow(
      /unrecognized/i,
    )
  })

  it("throws on null input", () => {
    expect(() => toDbStatus(null as never)).toThrow(/unrecognized/i)
  })
})

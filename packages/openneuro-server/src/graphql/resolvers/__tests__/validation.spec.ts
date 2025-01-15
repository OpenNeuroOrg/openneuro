import { validationSeveritySort } from "../validation"

vi.mock("../../../config.ts")

describe("validation resolvers", () => {
  describe("validationSeveritySort", () => {
    it("sorts severity error before warning", () => {
      const issues = [
        { severity: "warning" },
        { severity: "error" },
        { severity: "error" },
        { severity: "warning" },
        { severity: "error" },
      ]
      const sortedIssues = issues.sort(validationSeveritySort)
      expect(sortedIssues[0].severity).toBe("error")
      expect(sortedIssues[1].severity).toBe("error")
      expect(sortedIssues[2].severity).toBe("error")
      expect(sortedIssues[3].severity).toBe("warning")
    })
  })
})

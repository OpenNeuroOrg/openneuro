import { vi } from "vitest"
import { derivativeObject, githubDerivativeQuery } from "../derivatives"

vi.mock("ioredis")

describe("GraphQL derivatives", () => {
  describe("githubDerivativeQuery()", () => {
    it("constructs a correct URL", () => {
      expect(githubDerivativeQuery("ds000102", "mriqc").toString()).toEqual(
        "https://api.github.com/repos/OpenNeuroDerivatives/ds000102-mriqc",
      )
    })
  })
  describe("derivativeObject()", () => {
    it("returns expected values for mriqc", () => {
      expect(derivativeObject("ds000102", "mriqc")).toEqual({
        dataladUrl: new URL(
          "https://github.com/OpenNeuroDerivatives/ds000102-mriqc.git",
        ),
        local: false,
        name: "ds000102-mriqc",
        s3Url: new URL("s3://openneuro-derivatives/mriqc/ds000102-mriqc"),
      })
    })
    it("returns expected values for fmriprep", () => {
      expect(derivativeObject("ds000102", "fmriprep")).toEqual({
        dataladUrl: new URL(
          "https://github.com/OpenNeuroDerivatives/ds000102-fmriprep.git",
        ),
        local: false,
        name: "ds000102-fmriprep",
        s3Url: new URL("s3://openneuro-derivatives/fmriprep/ds000102-fmriprep"),
      })
    })
  })
})

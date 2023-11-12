import { checkDestination } from "../download.js"

vi.mock("../config.js")

let errorSpy
let dirSpy

beforeEach(() => {
  errorSpy = vi.spyOn(console, "error").mockImplementation()
  dirSpy = vi.spyOn(console, "dir").mockImplementation()
})
afterEach(() => {
  errorSpy.mockRestore()
  dirSpy.mockRestore()
})

describe("download.js", () => {
  describe("checkDestination()", () => {
    it("throws an error on existing directories", () => {
      expect(() => checkDestination("package.json"))
        .toThrowErrorMatchingSnapshot()
    })
  })
})

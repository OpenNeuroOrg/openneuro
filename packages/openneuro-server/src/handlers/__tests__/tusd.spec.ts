import { vi } from "vitest"
import { acceptUpload } from "../tusd"

vi.mock("../../config.ts")

describe("tusd handler", () => {
  it("generates the expected upload ID", () => {
    const accepted = acceptUpload("ds000001", "1234-5678", "path")
    expect(accepted.ChangeFileInfo.ID).toMatch(
      /^ds[0-9]{6}\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    )
    expect(accepted.ChangeFileInfo.MetaData.datasetId).toEqual("ds000001")
    expect(accepted.ChangeFileInfo.MetaData.uploaderId).toEqual("1234-5678")
  })
})

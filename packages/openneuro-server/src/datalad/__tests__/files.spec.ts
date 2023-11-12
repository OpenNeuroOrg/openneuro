import { vi } from "vitest"
import {
  computeTotalSize,
  decodeFilePath,
  encodeFilePath,
  fileUrl,
} from "../files"

vi.mock("ioredis")
vi.mock("../../config.ts")

const filename = "sub-01/anat/sub-01_T1w.nii.gz"

const mockRootFiles = [
  { filename: "README" },
  { filename: "dataset_description.json" },
]
const mockSub01 = [
  { filename: "sub-01/anat/sub-01_T1w.nii.gz" },
  { filename: "sub-01/func/sub-01_task-onebacktask_run-01_bold.nii.gz" },
]
const mockSub02 = [
  { filename: "sub-02/anat/sub-02_T1w.nii.gz" },
  { filename: "sub-02/func/sub-02_task-onebacktask_run-01_bold.nii.gz" },
]
const mockSub03 = [
  { filename: "sub-03/anat/sub-03_T1w.nii.gz" },
  { filename: "sub-03/func/sub-03_task-onebacktask_run-01_bold.nii.gz" },
]
const mockDerivatives = [{ filename: "derivatives/groundbreaking_output.html" }]
const mockFiles = [
  ...mockRootFiles,
  ...mockSub01,
  ...mockSub02,
  ...mockSub03,
  ...mockDerivatives,
]

describe("datalad files", () => {
  describe("encodeFilePath()", () => {
    it("should encode a nested path", () => {
      expect(encodeFilePath(filename)).toBe("sub-01:anat:sub-01_T1w.nii.gz")
    })
  })
  describe("decodeFilePath()", () => {
    it("decodes a file path", () => {
      expect(decodeFilePath("sub-01:anat:sub-01_T1w.nii.gz")).toBe(filename)
    })
  })
  describe("fileUrl()", () => {
    it("returns a working URL", () => {
      expect(fileUrl("ds000001", "", filename)).toBe(
        "http://datalad-0/datasets/ds000001/files/sub-01:anat:sub-01_T1w.nii.gz",
      )
    })
    it("handles path nesting", () => {
      expect(fileUrl("ds000001", "sub-01/anat", "sub-01_T1w.nii.gz")).toBe(
        "http://datalad-0/datasets/ds000001/files/sub-01:anat:sub-01_T1w.nii.gz",
      )
    })
  })
  describe("computeTotalSize()", () => {
    it("computes the size correctly", () => {
      const mockFileSizes = [
        { filename: "README", size: 234 },
        { filename: "dataset_description.json", size: 432 },
        { filename: "sub-01/anat/sub-01_T1w.nii.gz", size: 10858 },
        {
          filename: "sub-01/func/sub-01_task-onebacktask_run-01_bold.nii.gz",
          size: 1945682,
        },
      ]
      // @ts-expect-error Test is mocking this
      expect(computeTotalSize(mockFileSizes)).toBe(1957206)
    })
  })
})

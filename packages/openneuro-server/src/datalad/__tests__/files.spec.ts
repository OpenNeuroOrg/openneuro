import { vi } from "vitest"
import {
  computeTotalSize,
  decodeFilePath,
  encodeFilePath,
  entryToDatasetFile,
  fileUrl,
} from "../files"
import type { TreeEntry } from "../../cache/tree"

vi.mock("ioredis")
vi.mock("../../config.ts")
vi.mock("../../libs/redis", () => ({ redis: {} }))
vi.mock("../../libs/presign", () => ({
  getPresignedUrl: vi.fn().mockResolvedValue(
    "https://s3.amazonaws.com/bucket/key?presigned=true",
  ),
  publicS3Url: vi.fn().mockReturnValue(
    "https://s3.amazonaws.com/bucket/key?versionId=abc123",
  ),
}))

const filename = "sub-01/anat/sub-01_T1w.nii.gz"

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
  describe("entryToDatasetFile()", () => {
    it("returns a directory entry", async () => {
      const entry: TreeEntry = {
        n: "sub-01",
        h: "abc123",
        s: 0,
        k: "",
        v: "",
        b: "",
        p: false,
        d: true,
      }
      const result = await entryToDatasetFile(entry, "ds000001")
      expect(result).toEqual({
        id: "abc123",
        filename: "sub-01",
        directory: true,
        size: 0,
        urls: [],
      })
    })
    it("returns a presigned URL for private files", async () => {
      const entry: TreeEntry = {
        n: "sub-01_T1w.nii.gz",
        h: "def456",
        s: 12345,
        k: "datasets/ds000001/sub-01_T1w.nii.gz",
        v: "ver1",
        b: "private-bucket",
        p: true,
        d: false,
      }
      const result = await entryToDatasetFile(entry, "ds000001")
      expect(result).toEqual({
        id: "def456",
        filename: "sub-01_T1w.nii.gz",
        directory: false,
        size: 12345,
        urls: ["https://s3.amazonaws.com/bucket/key?presigned=true"],
      })
    })
    it("returns a public S3 URL for public files with S3 keys", async () => {
      const entry: TreeEntry = {
        n: "README",
        h: "ghi789",
        s: 500,
        k: "datasets/ds000001/README",
        v: "ver2",
        b: "",
        p: false,
        d: false,
      }
      const result = await entryToDatasetFile(entry, "ds000001")
      expect(result).toEqual({
        id: "ghi789",
        filename: "README",
        directory: false,
        size: 500,
        urls: ["https://s3.amazonaws.com/bucket/key?versionId=abc123"],
      })
    })
    it("falls back to server object URL when no S3 key/version", async () => {
      process.env.CRN_SERVER_URL = "https://openneuro.org"
      const entry: TreeEntry = {
        n: "sub-01_T1w.nii.gz",
        h: "jkl012",
        s: 9999,
        k: "",
        v: "",
        b: "",
        p: false,
        d: false,
      }
      const result = await entryToDatasetFile(entry, "ds000001")
      expect(result).toEqual({
        id: "jkl012",
        filename: "sub-01_T1w.nii.gz",
        directory: false,
        size: 9999,
        urls: [
          "https://openneuro.org/crn/datasets/ds000001/objects/jkl012?filename=sub-01_T1w.nii.gz",
        ],
      })
    })
  })
})

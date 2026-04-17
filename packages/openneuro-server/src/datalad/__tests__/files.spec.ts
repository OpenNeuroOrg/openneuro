import { vi } from "vitest"
import {
  computeTotalSize,
  decodeFilePath,
  encodeFilePath,
  entryToDatasetFile,
  fileUrl,
  getFileName,
  parseS3Url,
  workerFileToEntry,
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
        a: false,
        l: false,
      }
      const result = await entryToDatasetFile(entry, "ds000001")
      expect(result).toEqual({
        id: "abc123",
        filename: "sub-01",
        directory: true,
        size: 0,
        urls: [],
        annexed: false,
        symlink: false,
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
        a: false,
        l: false,
      }
      const result = await entryToDatasetFile(entry, "ds000001")
      expect(result).toEqual({
        id: "def456",
        filename: "sub-01_T1w.nii.gz",
        directory: false,
        size: 12345,
        urls: ["https://s3.amazonaws.com/bucket/key?presigned=true"],
        annexed: false,
        symlink: false,
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
        a: false,
        l: false,
      }
      const result = await entryToDatasetFile(entry, "ds000001")
      expect(result).toEqual({
        id: "ghi789",
        filename: "README",
        directory: false,
        size: 500,
        urls: ["https://s3.amazonaws.com/bucket/key?versionId=abc123"],
        annexed: false,
        symlink: false,
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
        a: false,
        l: false,
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
        annexed: false,
        symlink: false,
      })
    })
  })
  describe("parseS3Url()", () => {
    it("parses a standard S3 URL with versionId", () => {
      expect(
        parseS3Url(
          "https://s3.amazonaws.com/openneuro.org/datasets/ds000001/sub-01_T1w.nii.gz?versionId=abc123",
        ),
      ).toEqual({
        bucket: "openneuro.org",
        s3Key: "datasets/ds000001/sub-01_T1w.nii.gz",
        versionId: "abc123",
      })
    })
    it("returns empty versionId when missing", () => {
      const result = parseS3Url(
        "https://s3.amazonaws.com/openneuro.org/datasets/ds000001/README",
      )
      expect(result).toEqual({
        bucket: "openneuro.org",
        s3Key: "datasets/ds000001/README",
        versionId: "",
      })
    })
    it("decodes percent-encoded path components", () => {
      const result = parseS3Url(
        "https://s3.amazonaws.com/bucket/path%20with%20spaces/file%2B1.txt?versionId=v1",
      )
      expect(result).toEqual({
        bucket: "bucket",
        s3Key: "path with spaces/file+1.txt",
        versionId: "v1",
      })
    })
    it("returns null for invalid URLs", () => {
      expect(parseS3Url("not-a-url")).toBeNull()
    })
  })
  describe("workerFileToEntry()", () => {
    it("converts a directory file", () => {
      const file = {
        id: "tree-hash",
        filename: "sub-01",
        directory: true,
        size: 0,
        urls: [],
        annexed: false,
        symlink: false,
      }
      expect(workerFileToEntry(file, false)).toEqual({
        n: "sub-01",
        h: "tree-hash",
        s: 0,
        k: "",
        v: "",
        b: "",
        p: false,
        d: true,
        a: false,
        l: false,
      })
    })
    it("converts a public file with S3 URL", () => {
      const file = {
        id: "blob-hash",
        filename: "README",
        directory: false,
        size: 500,
        urls: [
          "https://s3.amazonaws.com/openneuro.org/datasets/ds000001/README?versionId=ver2",
        ],
        annexed: false,
        symlink: false,
      }
      const result = workerFileToEntry(file, false)
      expect(result).toEqual({
        n: "README",
        h: "blob-hash",
        s: 500,
        k: "datasets/ds000001/README",
        v: "ver2",
        b: "openneuro.org",
        p: false,
        d: false,
        a: false,
        l: false,
      })
    })
    it("stores empty bucket when it matches the default bucket", () => {
      const originalBucket = process.env.AWS_S3_PUBLIC_BUCKET
      process.env.AWS_S3_PUBLIC_BUCKET = "openneuro.org"
      const file = {
        id: "blob-hash",
        filename: "README",
        directory: false,
        size: 500,
        urls: [
          "https://s3.amazonaws.com/openneuro.org/datasets/ds000001/README?versionId=ver2",
        ],
        symlink: false,
        annexed: false,
      }
      const result = workerFileToEntry(file, false)
      expect(result.b).toBe("")
      process.env.AWS_S3_PUBLIC_BUCKET = originalBucket
    })
    it("sets presign flag from needsPresign parameter", () => {
      const file = {
        id: "blob-hash",
        filename: "data.nii.gz",
        directory: false,
        size: 1000,
        urls: [
          "https://s3.amazonaws.com/private-bucket/data.nii.gz?versionId=v1",
        ],
        symlink: false,
        annexed: false,
      }
      expect(workerFileToEntry(file, true).p).toBe(true)
      expect(workerFileToEntry(file, false).p).toBe(false)
    })
    it("handles a file with no URLs", () => {
      const file = {
        id: "blob-hash",
        filename: "data.nii.gz",
        directory: false,
        size: 1000,
        urls: [],
        symlink: false,
        annexed: false,
      }
      const result = workerFileToEntry(file, false)
      expect(result.k).toBe("")
      expect(result.v).toBe("")
      expect(result.b).toBe("")
    })
  })
  describe("fileUrl() with revision", () => {
    it("includes the revision in the URL path", () => {
      expect(
        fileUrl("ds000001", "", "README", "abc123def"),
      ).toBe(
        "http://datalad-0/datasets/ds000001/snapshots/abc123def/files/README",
      )
    })
    it("encodes nested paths with a revision", () => {
      expect(
        fileUrl("ds000001", "sub-01/anat", "sub-01_T1w.nii.gz", "abc123def"),
      ).toBe(
        "http://datalad-0/datasets/ds000001/snapshots/abc123def/files/sub-01:anat:sub-01_T1w.nii.gz",
      )
    })
  })
  describe("getFileName()", () => {
    it("joins path and filename", () => {
      expect(getFileName("sub-01/anat", "sub-01_T1w.nii.gz")).toBe(
        "sub-01:anat:sub-01_T1w.nii.gz",
      )
    })
    it("returns encoded filename when path is empty", () => {
      expect(getFileName("", "README")).toBe("README")
    })
    it("returns encoded path when filename is empty", () => {
      expect(getFileName("sub-01/anat", "")).toBe("sub-01:anat")
    })
  })
})

import { beforeEach, describe, expect, it, vi } from "vitest"
import CacheItem from "../../cache/item"
import { readme, readmeExtensions, readmeUrl } from "../readme"

vi.mock("../../config.ts")
vi.mock("../../cache/item")
vi.mock("../../libs/redis", () => ({
  getRedis: vi.fn(),
}))

const mockFetch = vi.fn()
global.fetch = mockFetch

const mockCacheItemGet = vi.fn()
vi.mocked(CacheItem).mockImplementation(() => {
  return { get: mockCacheItemGet } as unknown as CacheItem
})

const MOCK_DATASET_ID = "ds000001"
const MOCK_REVISION = "dce4b7b6653bcde9bdb7226a7c2b9499e77f2724"

/** A 404 for one extension probe */
const notFound = () => ({ status: 404, text: () => Promise.resolve("") })
/** A 200 for one extension probe */
const found = (body: string) => ({
  status: 200,
  text: () => Promise.resolve(body),
})

describe("datalad README files", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Always treat the cache as a miss so the fetcher runs
    mockCacheItemGet.mockImplementation((fetcher) => fetcher())
  })

  describe("readmeUrl()", () => {
    it.each([
      ["md", "README.md"],
      ["rst", "README.rst"],
      ["txt", "README.txt"],
      ["", "README"],
    ])("appends %s as %s", (extension, filename) => {
      expect(readmeUrl(MOCK_DATASET_ID, MOCK_REVISION, extension)).toBe(
        `http://datalad-0/datasets/${MOCK_DATASET_ID}/snapshots/${MOCK_REVISION}/files/${filename}`,
      )
    })
  })

  describe("readme()", () => {
    it.each(readmeExtensions.map((extension, index) => [extension, index]))(
      "returns the README with extension '%s' after earlier extensions 404",
      async (extension, index) => {
        // Every extension preferred over this one is missing
        for (let n = 0; n < index; n++) {
          mockFetch.mockResolvedValueOnce(notFound())
        }
        mockFetch.mockResolvedValueOnce(found(`# ${extension || "bare"}`))
        const result = await readme({
          id: MOCK_DATASET_ID,
          revision: MOCK_REVISION,
        })
        expect(result).toBe(`# ${extension || "bare"}`)
        // Probes stop at the first hit, in preference order
        expect(mockFetch).toHaveBeenCalledTimes(index + 1)
        expect(mockFetch).toHaveBeenLastCalledWith(
          readmeUrl(MOCK_DATASET_ID, MOCK_REVISION, extension),
        )
      },
    )

    it("returns null when no extension exists", async () => {
      mockFetch.mockResolvedValue(notFound())
      const result = await readme({
        id: MOCK_DATASET_ID,
        revision: MOCK_REVISION,
      })
      expect(result).toBeNull()
      expect(mockFetch).toHaveBeenCalledTimes(readmeExtensions.length)
    })

    it("resolves a snapshot parent object", async () => {
      mockFetch.mockResolvedValueOnce(found("# snapshot readme"))
      const result = await readme({
        id: `${MOCK_DATASET_ID}:1.0.0`,
        tag: "1.0.0",
        hexsha: MOCK_REVISION,
      })
      expect(result).toBe("# snapshot readme")
      expect(mockFetch).toHaveBeenCalledWith(
        readmeUrl(MOCK_DATASET_ID, MOCK_REVISION, "md"),
      )
    })
  })
})

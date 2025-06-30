import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import yaml from "js-yaml"
import * as Sentry from "@sentry/node"
import CacheItem from "../../cache/item"
import { fileUrl } from "../files"
import { datasetOrSnapshot } from "../../utils/datasetOrSnapshot"
import { getDescriptionObject } from "../description"
import { contributors } from "../contributors"

vi.mock("../../libs/authentication/jwt", () => ({
  sign: vi.fn(() => "mock_jwt_token"),
  verify: vi.fn(() => ({ userId: "mock_user_id" })),
}))

// Mock other external dependencies directly used by 'contributors.ts'
vi.mock("js-yaml", () => ({
  default: {
    // Mock the default export for js-yaml
    load: vi.fn(),
  },
}))

vi.mock("@sentry/node", () => ({
  captureMessage: vi.fn(),
  captureException: vi.fn(),
}))

vi.mock("../../cache/item")
vi.mock("../files")
vi.mock("../../utils/datasetOrSnapshot")
vi.mock("../description")
vi.mock("../libs/redis", () => ({
  redis: vi.fn(), // Mock redis client
}))

// Cast mocks to their Vi.Mocked versions for type safety and easier access
const mockYamlLoad = vi.mocked(yaml.load)
const mockSentryCaptureException = vi.mocked(Sentry.captureException) // Mock Sentry
const mockFileUrl = vi.mocked(fileUrl)
const mockDatasetOrSnapshot = vi.mocked(datasetOrSnapshot)
const mockGetDescriptionObject = vi.mocked(getDescriptionObject)

// Mock the global fetch API
const mockFetch = vi.fn()
global.fetch = mockFetch

// Helper to mock CacheItem's .get() method
const mockCacheItemGet = vi.fn()
vi.mocked(CacheItem).mockImplementation((_redis, _type, _key) => {
  return {
    get: mockCacheItemGet,
  } as unknown as CacheItem
})

describe("contributors (core functionality)", () => {
  const MOCK_DATASET_ID = "ds000001"
  const MOCK_REVISION = "dce4b7b6653bcde9bdb7226a7c2b9499e77f2724"

  beforeEach(() => {
    vi.clearAllMocks()

    mockDatasetOrSnapshot.mockReturnValue({
      datasetId: MOCK_DATASET_ID,
      revision: MOCK_REVISION,
    })
    mockFileUrl.mockImplementation(
      (datasetId, path, filename, revision) =>
        `http://example.com/${datasetId}/${revision}/${filename}`,
    )

    mockCacheItemGet.mockImplementation((fetcher) => fetcher())
  })

  // --- Test Scenarios for `contributors` export function ---

  it("should return contributors from datacite.yml if available and valid", async () => {
    const dataciteYamlContent = `
authors:
  - firstname: John
    lastname: Doe
    id: ORCID:0000-0001-2345-6789
  - firstname: Jane
    lastname: Smith
`
    const parsedDatacite = {
      authors: [
        { firstname: "John", lastname: "Doe", id: "ORCID:0000-0001-2345-6789" },
        { firstname: "Jane", lastname: "Smith" },
      ],
    }

    mockFetch.mockResolvedValueOnce({
      status: 200,
      headers: new Headers({ "Content-Type": "application/yaml" }),
      text: () => Promise.resolve(dataciteYamlContent),
    })
    mockYamlLoad.mockReturnValueOnce(parsedDatacite)

    const result = await contributors({})

    expect(result).toEqual([
      {
        name: "John Doe",
        firstname: "John",
        lastname: "Doe",
        id: "ORCID:0000-0001-2345-6789",
      },
      {
        name: "Jane Smith",
        firstname: "Jane",
        lastname: "Smith",
        id: undefined,
      },
    ])
    expect(mockGetDescriptionObject).not.toHaveBeenCalled() // Should not fall back

    expect(mockSentryCaptureException).not.toHaveBeenCalled()
  })

  it("should fall back to dataset_description.json if datacite.yml is 404", async () => {
    const datasetDescriptionJson = {
      Authors: ["Author One", "Author Two"],
    }

    mockFetch.mockResolvedValueOnce({
      status: 404, // Simulate datacite.yml 404
      headers: new Headers(),
      text: () => Promise.resolve("Not Found"),
    })
    mockGetDescriptionObject.mockResolvedValueOnce(datasetDescriptionJson)

    const result = await contributors({})

    expect(result).toEqual([{ name: "Author One" }, { name: "Author Two" }])
    expect(mockGetDescriptionObject).toHaveBeenCalledWith(
      MOCK_DATASET_ID,
      MOCK_REVISION,
    )

    expect(mockSentryCaptureException).toHaveBeenCalledWith(expect.any(Error))
  })

  it("should fall back to dataset_description.json if datacite.yml parsing fails", async () => {
    const dataciteYamlContent = `invalid: - yaml`
    const datasetDescriptionJson = {
      Authors: ["BIDS Author A"],
    }

    mockFetch.mockResolvedValueOnce({
      status: 200,
      headers: new Headers({ "Content-Type": "application/yaml" }),
      text: () => Promise.resolve(dataciteYamlContent),
    })
    mockYamlLoad.mockImplementationOnce(() => {
      throw new Error("YAML parsing error")
    }) // Simulate YAML parsing failure
    mockGetDescriptionObject.mockResolvedValueOnce(datasetDescriptionJson)

    const result = await contributors({})

    expect(result).toEqual([{ name: "BIDS Author A" }])
    expect(mockGetDescriptionObject).toHaveBeenCalled()
    expect(mockSentryCaptureException).toHaveBeenCalledWith(expect.any(Error))
  })

  it("should return empty array if both datacite.yml and dataset_description.json fail", async () => {
    // Mock datacite.yml fetch to fail
    mockFetch.mockResolvedValueOnce({
      status: 500,
      headers: new Headers(),
      text: () => Promise.resolve("Server Error"),
    })
    // Mock dataset_description.json fetch to fail
    mockGetDescriptionObject.mockRejectedValueOnce(
      new Error("Description fetch failed"),
    )

    const result = await contributors({})

    expect(result).toEqual([])
    expect(mockSentryCaptureException).toHaveBeenCalledWith(expect.any(Error))
    expect(mockSentryCaptureException).toHaveBeenCalledWith(expect.any(Error))
    expect(mockSentryCaptureException).toHaveBeenCalledTimes(2)
  })

  it("should return default empty array if no authors array in datacite.yml or dataset_description.json", async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      headers: new Headers({ "Content-Type": "application/yaml" }),
      text: () => Promise.resolve("some_other_field: value"),
    })
    mockYamlLoad.mockReturnValueOnce({ some_other_field: "value" }) // No 'authors' field in datacite.yml
    mockGetDescriptionObject.mockResolvedValueOnce({
      SomeOtherField: "value",
    }) // No 'Authors' field in dataset_description.json
    const result = await contributors({})
    expect(result).toEqual([])
    expect(mockSentryCaptureException).not.toHaveBeenCalled()
  })

  it("should capture message if datacite.yml has unexpected content type but still parses", async () => {
    const dataciteYamlContent = `authors: []`
    const datasetDescriptionJson = {
      Authors: ["BIDS Author C"],
    }

    mockFetch.mockResolvedValueOnce({
      status: 200,
      headers: new Headers({ "Content-Type": "text/plain" }),
      text: () => Promise.resolve(dataciteYamlContent),
    })
    mockYamlLoad.mockReturnValueOnce({ authors: [] })
    mockGetDescriptionObject.mockResolvedValueOnce(datasetDescriptionJson)
    await contributors({})
    expect(mockSentryCaptureException).not.toHaveBeenCalled()
  })
})

import { beforeEach, describe, expect, it, vi } from "vitest"
import yaml from "js-yaml"
import * as Sentry from "@sentry/node"
import CacheItem from "../../cache/item"
import { fileUrl } from "../files"
import { datasetOrSnapshot } from "../../utils/datasetOrSnapshot"
import { description } from "../description"
import { creators } from "../creators"

vi.mock("../../libs/authentication/jwt", () => ({
  sign: vi.fn(() => "mock_jwt_token"),
  verify: vi.fn(() => ({ userId: "mock_user_id" })),
}))

vi.mock("js-yaml", () => ({
  default: {
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
  redis: vi.fn(),
}))

const mockYamlLoad = vi.mocked(yaml.load)
const mockSentryCaptureMessage = vi.mocked(Sentry.captureMessage)
const mockSentryCaptureException = vi.mocked(Sentry.captureException)
const mockFileUrl = vi.mocked(fileUrl)
const mockDatasetOrSnapshot = vi.mocked(datasetOrSnapshot)
const mockDescription = vi.mocked(description)

const mockFetch = vi.fn()
global.fetch = mockFetch

const mockCacheItemGet = vi.fn()
vi.mocked(CacheItem).mockImplementation((_redis, _type, _key) => {
  return {
    get: mockCacheItemGet,
  } as unknown as CacheItem
})

describe("creators (core functionality)", () => {
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

  it("should fall back to dataset_description.json if datacite file is 404", async () => {
    const datasetDescriptionJson = {
      Authors: ["Author One", "Author Two"],
    }

    mockFetch.mockResolvedValueOnce({
      status: 404,
      headers: new Headers(),
      text: () => Promise.resolve("Not Found"),
    })

    mockCacheItemGet.mockImplementationOnce((fetcher) =>
      fetcher().then(() => null)
    )
    mockDescription.mockResolvedValueOnce(datasetDescriptionJson)
    const result = await creators({
      id: MOCK_DATASET_ID,
      revision: MOCK_REVISION,
    })
    expect(result).toEqual([{ name: "Author One" }, { name: "Author Two" }])
    expect(mockDescription).toHaveBeenCalledWith({
      id: MOCK_DATASET_ID,
      revision: MOCK_REVISION,
    })
    expect(mockSentryCaptureMessage).toHaveBeenCalledWith(
      `Loaded creators from dataset_description.json via description resolver for ${MOCK_DATASET_ID}:${MOCK_REVISION}`,
    )
  })

  it("should fall back to dataset_description.json if datacite file parsing fails", async () => {
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
    })
    mockCacheItemGet.mockImplementationOnce((fetcher) =>
      fetcher().catch(() => null)
    )
    mockDescription.mockResolvedValueOnce(datasetDescriptionJson)
    const result = await creators({
      id: MOCK_DATASET_ID,
      revision: MOCK_REVISION,
    })
    expect(result).toEqual([{ name: "BIDS Author A" }])
    expect(mockDescription).toHaveBeenCalled()
    expect(mockSentryCaptureException).toHaveBeenCalledWith(expect.any(Error))
    expect(mockSentryCaptureException).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining(
          `Found datacite file for dataset ${MOCK_DATASET_ID}`,
        ),
      }),
    )
    expect(mockSentryCaptureMessage).toHaveBeenCalledWith(
      `Loaded creators from dataset_description.json via description resolver for ${MOCK_DATASET_ID}:${MOCK_REVISION}`,
    )
  })

  it("should return empty array if both datacite file and dataset_description.json fail", async () => {
    mockFetch.mockResolvedValueOnce({
      status: 500,
      headers: new Headers(),
      text: () => Promise.resolve("Server Error"),
    })
    mockCacheItemGet.mockImplementationOnce((fetcher) =>
      fetcher().catch(() => null)
    )
    mockDescription.mockRejectedValueOnce(
      new Error("Description fetch failed"),
    )
    const result = await creators({
      id: MOCK_DATASET_ID,
      revision: MOCK_REVISION,
    })
    expect(result).toEqual([])
    expect(mockSentryCaptureException).toHaveBeenCalledTimes(2)
  })

  it("should return default empty array if no creators array in datacite file or dataset_description.json (or wrong resourceTypeGeneral in datacite file)", async () => {
    const dataciteYamlContent =
      `data:\n  attributes:\n    types:\n      resourceTypeGeneral: Software\n    creators: []`
    const parsedDatacite = {
      data: {
        attributes: {
          types: { resourceTypeGeneral: "Software" },
          creators: [],
        },
      },
    }

    mockFetch.mockResolvedValueOnce({
      status: 200,
      headers: new Headers({ "Content-Type": "application/yaml" }),
      text: () => Promise.resolve(dataciteYamlContent),
    })
    mockYamlLoad.mockReturnValueOnce(parsedDatacite)
    mockDescription.mockResolvedValueOnce(null)
    const result = await creators({
      id: MOCK_DATASET_ID,
      revision: MOCK_REVISION,
    })
    expect(result).toEqual([])
    expect(mockSentryCaptureMessage).toHaveBeenCalledWith(
      `Datacite file for ${MOCK_DATASET_ID}:${MOCK_REVISION} found but resourceTypeGeneral is 'Software', not 'Dataset'.`,
    )
    expect(mockDescription).toHaveBeenCalled()
    expect(mockSentryCaptureException).not.toHaveBeenCalled()
  })

  it("should return default empty array if datacite file is Dataset type but provides no creators", async () => {
    const dataciteYamlContent =
      `data:\n  attributes:\n    types:\n      resourceTypeGeneral: Dataset\n    creators: []`
    const parsedDatacite = {
      data: {
        attributes: {
          types: { resourceTypeGeneral: "Dataset" },
          creators: [],
        },
      },
    }

    mockFetch.mockResolvedValueOnce({
      status: 200,
      headers: new Headers({ "Content-Type": "application/yaml" }),
      text: () => Promise.resolve(dataciteYamlContent),
    })
    mockYamlLoad.mockReturnValueOnce(parsedDatacite)
    mockDescription.mockResolvedValueOnce(null)

    const result = await creators({
      id: MOCK_DATASET_ID,
      revision: MOCK_REVISION,
    })

    expect(result).toEqual([])
    expect(mockSentryCaptureMessage).toHaveBeenCalledWith(
      `Datacite file for ${MOCK_DATASET_ID}:${MOCK_REVISION} is Dataset type but provided no creators.`,
    )
    expect(mockDescription).toHaveBeenCalled()
    expect(mockSentryCaptureException).not.toHaveBeenCalled()
  })

  it("should capture message if datacite file has unexpected content type but still parses", async () => {
    const dataciteYamlContent =
      `data:\n  attributes:\n    types:\n      resourceTypeGeneral: Dataset\n    creators: []`
    const parsedDatacite = {
      data: {
        attributes: {
          types: { resourceTypeGeneral: "Dataset" },
          creators: [],
        },
      },
    }
    const datasetDescriptionJson = {
      Authors: ["Fallback Author"],
    }

    mockFetch.mockResolvedValueOnce({
      status: 200,
      headers: new Headers({ "Content-Type": "text/plain" }),
      text: () => Promise.resolve(dataciteYamlContent),
    })
    mockYamlLoad.mockReturnValueOnce(parsedDatacite)
    mockDescription.mockResolvedValueOnce(datasetDescriptionJson)
    const result = await creators({
      id: MOCK_DATASET_ID,
      revision: MOCK_REVISION,
    })
    expect(mockSentryCaptureMessage).toHaveBeenCalledWith(
      expect.stringContaining(
        `Datacite file for ${MOCK_DATASET_ID}:${MOCK_REVISION} served with unexpected Content-Type: text/plain. Attempting YAML parse anyway.`,
      ),
    )
    expect(mockSentryCaptureException).not.toHaveBeenCalled()
    expect(mockSentryCaptureMessage).toHaveBeenCalledWith(
      `Datacite file for ${MOCK_DATASET_ID}:${MOCK_REVISION} is Dataset type but provided no creators.`,
    )
    expect(mockSentryCaptureMessage).toHaveBeenCalledWith(
      `Loaded creators from dataset_description.json via description resolver for ${MOCK_DATASET_ID}:${MOCK_REVISION}`,
    )
    expect(result).toEqual([{ name: "Fallback Author" }])
  })
})

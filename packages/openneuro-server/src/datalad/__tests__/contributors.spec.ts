import { beforeEach, describe, expect, it, vi } from "vitest"
import yaml from "js-yaml"
import * as Sentry from "@sentry/node"
import CacheItem from "../../cache/item"
import { fileUrl } from "../files"
import { datasetOrSnapshot } from "../../utils/datasetOrSnapshot"
import { contributors } from "../contributors"

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
vi.mock("../libs/redis", () => ({
  redis: vi.fn(),
}))

const mockYamlLoad = vi.mocked(yaml.load)
const mockSentryCaptureMessage = vi.mocked(Sentry.captureMessage)
const mockSentryCaptureException = vi.mocked(Sentry.captureException)
const mockFileUrl = vi.mocked(fileUrl)
const mockDatasetOrSnapshot = vi.mocked(datasetOrSnapshot)

const mockFetch = vi.fn()
global.fetch = mockFetch

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

  it("should return empty array if both datacite file and dataset_description.json fail", async () => {
    mockFetch.mockResolvedValueOnce({
      status: 500,
      headers: new Headers(),
      text: () => Promise.resolve("Server Error"),
    })
    mockCacheItemGet.mockImplementationOnce((fetcher) =>
      fetcher().catch(() => null)
    )
    const result = await contributors({
      id: MOCK_DATASET_ID,
      revision: MOCK_REVISION,
    })
    expect(result).toEqual([])
    expect(mockSentryCaptureException).toHaveBeenCalledTimes(1)
  })

  it("should return default empty array if no contributors array in datacite file or dataset_description.json (or wrong resourceTypeGeneral in datacite file)", async () => {
    const dataciteYamlContent =
      `data:\n  attributes:\n    types:\n      resourceTypeGeneral: Software\n    contributors: []`
    const parsedDatacite = {
      data: {
        attributes: {
          types: { resourceTypeGeneral: "Software" },
          contributors: [],
        },
      },
    }

    mockFetch.mockResolvedValueOnce({
      status: 200,
      headers: new Headers({ "Content-Type": "application/yaml" }),
      text: () => Promise.resolve(dataciteYamlContent),
    })
    mockYamlLoad.mockReturnValueOnce(parsedDatacite)
    const result = await contributors({
      id: MOCK_DATASET_ID,
      revision: MOCK_REVISION,
    })
    expect(result).toEqual([])
    expect(mockSentryCaptureMessage).toHaveBeenCalledWith(
      `Datacite file for ${MOCK_DATASET_ID}:${MOCK_REVISION} found but resourceTypeGeneral is 'Software', not 'Dataset'.`,
    )
    expect(mockSentryCaptureException).not.toHaveBeenCalled()
  })

  it("should return default empty array if datacite file is Dataset type but provides no contributors", async () => {
    const dataciteYamlContent =
      `data:\n  attributes:\n    types:\n      resourceTypeGeneral: Dataset\n    contributors: []`
    const parsedDatacite = {
      data: {
        attributes: {
          types: { resourceTypeGeneral: "Dataset" },
          contributors: [],
        },
      },
    }

    mockFetch.mockResolvedValueOnce({
      status: 200,
      headers: new Headers({ "Content-Type": "application/yaml" }),
      text: () => Promise.resolve(dataciteYamlContent),
    })
    mockYamlLoad.mockReturnValueOnce(parsedDatacite)
    const result = await contributors({
      id: MOCK_DATASET_ID,
      revision: MOCK_REVISION,
    })

    expect(result).toEqual([])
    expect(mockSentryCaptureMessage).toHaveBeenCalledWith(
      `Datacite file for ${MOCK_DATASET_ID}:${MOCK_REVISION} is Dataset type but provided no contributors.`,
    )
    expect(mockSentryCaptureException).not.toHaveBeenCalled()
  })

  it("should capture message if datacite file has unexpected content type but still parses", async () => {
    const dataciteYamlContent =
      `data:\n  attributes:\n    types:\n      resourceTypeGeneral: Dataset\n    contributors: []`
    const parsedDatacite = {
      data: {
        attributes: {
          types: { resourceTypeGeneral: "Dataset" },
          contributors: [],
        },
      },
    }

    mockFetch.mockResolvedValueOnce({
      status: 200,
      headers: new Headers({ "Content-Type": "text/plain" }),
      text: () => Promise.resolve(dataciteYamlContent),
    })
    mockYamlLoad.mockReturnValueOnce(parsedDatacite)
    const result = await contributors({
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
      `Datacite file for ${MOCK_DATASET_ID}:${MOCK_REVISION} is Dataset type but provided no contributors.`,
    )
    expect(result).toEqual([])
  })
})

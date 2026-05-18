import { beforeEach, describe, expect, it, vi } from "vitest"
import { assembleMetadata } from "../metadata.js"

vi.mock("ioredis")
vi.mock("../../../config", () => ({
  default: { url: "https://openneuro.org" },
}))
vi.mock("../index", () => ({
  createDOI: (datasetId: string, snapshotId: string) =>
    `10.18112/openneuro.${datasetId}.v${snapshotId}`,
}))
vi.mock("../../../utils/datacite-utils")
vi.mock("../../../datalad/description")
vi.mock("../../../graphql/resolvers/summary")

import { getDataciteYml } from "../../../utils/datacite-utils.js"
import { description } from "../../../datalad/description.js"

const mockGetDataciteYml = vi.mocked(getDataciteYml)
const mockDescription = vi.mocked(description)

const baseYml = {
  data: {
    attributes: {
      creators: [{ name: "Doe, Jane", nameType: "Personal" }],
      titles: [{ title: "Test Dataset" }],
    },
  },
}

const baseDesc = {
  Name: "Test Dataset",
  Authors: [],
}

beforeEach(() => {
  vi.resetAllMocks()
  mockDescription.mockResolvedValue(baseDesc as never)
})

describe("assembleMetadata", () => {
  describe("contributor name validation", () => {
    it("keeps a contributor whose name has one comma (surname, given)", async () => {
      mockGetDataciteYml.mockResolvedValue({
        ...baseYml,
        data: {
          attributes: {
            ...baseYml.data.attributes,
            contributors: [
              { name: "Doe, Jane", contributorType: "DataCollector" },
            ],
          },
        },
      } as never)

      const result = await assembleMetadata("ds000001", "1.0.0")
      expect(result.contributors).toHaveLength(1)
      expect(result.contributors![0].name).toBe("Doe, Jane")
    })

    it("keeps a contributor whose name has no comma", async () => {
      mockGetDataciteYml.mockResolvedValue({
        ...baseYml,
        data: {
          attributes: {
            ...baseYml.data.attributes,
            contributors: [
              { name: "OpenNeuro Team", contributorType: "HostingInstitution" },
            ],
          },
        },
      } as never)

      const result = await assembleMetadata("ds000001", "1.0.0")
      expect(result.contributors).toHaveLength(1)
      expect(result.contributors![0].name).toBe("OpenNeuro Team")
    })

    it("strips a contributor whose name contains more than one comma", async () => {
      mockGetDataciteYml.mockResolvedValue({
        ...baseYml,
        data: {
          attributes: {
            ...baseYml.data.attributes,
            contributors: [
              {
                name: "Doe, Jane, Smith, John",
                contributorType: "DataCollector",
              },
            ],
          },
        },
      } as never)

      const result = await assembleMetadata("ds000001", "1.0.0")
      expect(result.contributors).toBeUndefined()
    })

    it("strips only the invalid contributor and keeps the valid ones", async () => {
      mockGetDataciteYml.mockResolvedValue({
        ...baseYml,
        data: {
          attributes: {
            ...baseYml.data.attributes,
            contributors: [
              { name: "Doe, Jane", contributorType: "DataCollector" },
              {
                name: "Smith, John, Doe, Jane",
                contributorType: "DataCollector",
              },
              { name: "Williams, Bob", contributorType: "DataManager" },
            ],
          },
        },
      } as never)

      const result = await assembleMetadata("ds000001", "1.0.0")
      expect(result.contributors).toHaveLength(2)
      expect(result.contributors!.map((c) => c.name)).toEqual([
        "Doe, Jane",
        "Williams, Bob",
      ])
    })
  })

  describe("contributor field stripping", () => {
    it("removes the order field from contributors", async () => {
      mockGetDataciteYml.mockResolvedValue({
        ...baseYml,
        data: {
          attributes: {
            ...baseYml.data.attributes,
            contributors: [
              {
                name: "Doe, Jane",
                contributorType: "DataCollector",
                order: 1,
              },
            ],
          },
        },
      } as never)

      const result = await assembleMetadata("ds000001", "1.0.0")
      expect(result.contributors).toHaveLength(1)
      expect(result.contributors![0]).not.toHaveProperty("order")
    })
  })
})

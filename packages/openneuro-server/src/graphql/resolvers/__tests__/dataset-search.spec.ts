import { vi } from "vitest"
import {
  decodeCursor,
  elasticRelayConnection,
  encodeCursor,
} from "../dataset-search"

vi.mock("ioredis")
vi.mock("../../../elasticsearch/elastic-client.ts")
vi.mock("../../../config.ts")

describe("dataset search resolvers", () => {
  describe("encodeCursor()", () => {
    it("returns an encoded string", () => {
      expect(encodeCursor([2.513, "ds00005"])).toEqual(
        "WzIuNTEzLCJkczAwMDA1Il0=",
      )
    })
  })
  describe("decodeCursor()", () => {
    it("returns a decoded array", () => {
      expect(decodeCursor("WzIuNTEzLCJkczAwMDA1Il0=")).toEqual([
        2.513,
        "ds00005",
      ])
    })
  })
  describe("elasticRelayConnection()", () => {
    it("returns a relay cursor for empty ApiResponse", async () => {
      const emptyApiResponse = {
        hits: {
          hits: [],
          total: { value: 0 },
        },
      }

      // No results allowed structure
      const nullRelayConnection = {
        edges: [],
        pageInfo: {
          count: 0,
          endCursor: null,
          hasNextPage: false,
          startCursor: null,
          hasPreviousPage: false,
        },
      }
      // @ts-expect-error Mock version does not use all arguments
      const connection = await elasticRelayConnection(emptyApiResponse, {
        dataset: vi.fn(),
      })
      expect(connection).toMatchObject(nullRelayConnection)
    })

    it("returns a relay cursor for ApiResponse with results", () => {
      const mockResolvers = {
        dataset: vi.fn(),
      }

      const expectedApiResponse = {
        hits: {
          hits: [
            { _source: { id: "testdataset1" } },
            { _source: { id: "testdataset2" } },
            { _source: { id: "testdataset3" }, sort: [1] },
          ],
          total: { value: 10 },
        },
      }

      const resultsRelayConnection = {
        edges: expectedApiResponse.hits.hits.map((hit) => {
          // This skips the dataset resolver logic and passes this back
          mockResolvers.dataset.mockReturnValueOnce(hit._source)
          return {
            node: hit._source,
            id: hit._source.id,
          }
        }),
        pageInfo: {
          count: 10,
          endCursor: "WzFd",
          hasNextPage: true,
          startCursor: null,
          hasPreviousPage: false,
        },
      }
      const connection = elasticRelayConnection(
        expectedApiResponse,
        "test",
        3,
        mockResolvers,
      )
      expect(connection).toMatchObject(resultsRelayConnection)
    })
  })
})

import { ApiResponse } from '@elastic/elasticsearch'
import {
  encodeCursor,
  decodeCursor,
  elasticRelayConnection,
} from '../dataset-search'

jest.mock('../../../elasticsearch/elastic-client.js')

describe('dataset search resolvers', () => {
  describe('encodeCursor()', () => {
    it('returns an encoded string', () => {
      expect(encodeCursor([2.513, 'ds00005'])).toEqual(
        'WzIuNTEzLCJkczAwMDA1Il0=',
      )
    })
  })
  describe('decodeCursor()', () => {
    it('returns a decoded array', () => {
      expect(decodeCursor('WzIuNTEzLCJkczAwMDA1Il0=')).toEqual([
        2.513,
        'ds00005',
      ])
    })
  })
  describe('elasticRelayConnection()', () => {
    it('returns a relay cursor for empty ApiResponse', () => {
      const emptyApiResponse = {
        body: {
          hits: {
            hits: [],
            total: { value: 0 },
          },
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
      const connection = elasticRelayConnection(emptyApiResponse, {
        dataset: jest.fn(),
      })
      expect(connection).toMatchObject(nullRelayConnection)
    })

    it('returns a relay cursor for ApiResponse with results', () => {
      const mockResolvers = {
        dataset: jest.fn(),
      }

      const expectedApiResponse = {
        body: {
          hits: {
            hits: [
              { _source: { id: 'testdataset1' } },
              { _source: { id: 'testdataset2' } },
              { _source: { id: 'testdataset3' } },
            ],
            total: { value: 10 },
          },
        },
      }

      const resultsRelayConnection = {
        edges: expectedApiResponse.body.hits.hits.map(hit => {
          // This skips the dataset resolver logic and passes this back
          mockResolvers.dataset.mockReturnValueOnce(hit._source)
          return { node: hit._source }
        }),
        pageInfo: {
          count: 10,
          endCursor: 'W251bGwsbnVsbF0=',
          hasNextPage: true,
          startCursor: null,
          hasPreviousPage: false,
        },
      }
      const connection = elasticRelayConnection(
        expectedApiResponse,
        mockResolvers,
      )
      expect(connection).toMatchObject(resultsRelayConnection)
    })
  })
})

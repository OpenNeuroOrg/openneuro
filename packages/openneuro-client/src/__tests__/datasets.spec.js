// eslint-disable-next-line
import { createClient, testDsId } from '../client'
import { getDataset, getDatasets, createDataset } from '../datasets'

vi.mock('../client')
vi.mock('../../../openneuro-server/src/config.js')

const gqlClient = createClient('http://test-uri')

describe('datasets.js', () => {
  describe('getDataset query', () => {
    it('returns the expected dataset', () => {
      return gqlClient
        .query({ query: getDataset, variables: { id: testDsId } })
        .then(({ data: { dataset } }) => {
          expect(dataset.id).toBe(testDsId)
        })
    })
  })
  describe('getDatasets query', () => {
    it('returns multiple datasets', () => {
      return gqlClient.query({ query: getDatasets }).then(({ data }) => {
        expect(data.datasets.edges).toHaveLength(2)
        // Make sure the array is Dataset objects
        expect(data.datasets).toHaveProperty('__typename', 'DatasetConnection')
        expect(data.datasets.edges[0].node).toHaveProperty(
          '__typename',
          'Dataset',
        )
      })
    })
  })
  describe('createDataset mutation', () => {
    it('creates a dataset', () => {
      return gqlClient
        .mutate({
          mutation: createDataset,
          variables: { affirmedDefaced: false, affirmedConsent: true },
        })
        .then(({ data: { createDataset } }) => {
          expect(createDataset.__typename).toBe('Dataset')
        })
    })
  })
})

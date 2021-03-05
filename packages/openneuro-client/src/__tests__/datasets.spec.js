// eslint-disable-next-line
import { createClient, testDsId } from '../client'
import { getDataset, getDatasets, createDataset } from '../datasets'

jest.mock('../client')
jest.mock('../../../openneuro-server/src/config.js')

const gqlClient = createClient('http://test-uri')

describe('datasets.js', () => {
  describe('getDataset query', () => {
    it('returns the expected dataset', done => {
      gqlClient
        .query({ query: getDataset, variables: { id: testDsId } })
        .then(({ data: { dataset } }) => {
          expect(dataset.id).toBe(testDsId)
        })
        .then(done)
    })
  })
  describe('getDatasets query', () => {
    it('returns multiple datasets', done => {
      gqlClient
        .query({ query: getDatasets })
        .then(({ data }) => {
          expect(data.datasets.edges).toHaveLength(2)
          // Make sure the array is Dataset objects
          expect(data.datasets).toHaveProperty(
            '__typename',
            'DatasetConnection',
          )
          expect(data.datasets.edges[0].node).toHaveProperty(
            '__typename',
            'Dataset',
          )
        })
        .then(done)
    })
  })
  describe('createDataset mutation', () => {
    it('creates a dataset', done => {
      gqlClient
        .mutate({
          mutation: createDataset,
          variables: { affirmedDefaced: false, affirmedConsent: true },
        })
        .then(({ data: { createDataset } }) => {
          expect(createDataset.__typename).toBe('Dataset')
        })
        .then(done)
    })
  })
})

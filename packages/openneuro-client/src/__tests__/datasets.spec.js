import createClient from '../client'
import { testDsId, testTime } from '../client'
import { getDataset, getDatasets } from '../datasets'

jest.mock('../client')

const gqlClient = createClient('http://test-uri')

describe('datasets.js', () => {
  describe('getDataset query', () => {
    it('returns the expected dataset', done => {
      gqlClient
        .query({ query: getDataset(testDsId) })
        .then(({ data: { dataset } }) => {
          expect(dataset.id).toBe(testDsId)
        })
        .then(done)
    })
    it('does not return extra data', done => {
      gqlClient
        .query({ query: getDataset(testDsId) })
        .then(({ data: { dataset } }) => {
          expect(dataset.created).toBeUndefined()
        })
        .then(done)
    })
  })
  describe('getDataset query', () => {
    it('returns multiple datasets', done => {
      gqlClient
        .query({ query: getDatasets() })
        .then(({ data: { datasets } }) => {
          expect(datasets).toHaveLength(2)
          // Make sure the array is Dataset objects
          expect(datasets[0]).toHaveProperty('__typename', 'Dataset')
        })
        .then(done)
    })
  })
})

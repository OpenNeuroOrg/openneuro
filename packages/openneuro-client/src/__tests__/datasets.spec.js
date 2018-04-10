import createClient from '../client'
import { testDsId, testTime } from '../client'
import { getDataset } from '../datasets'

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
})

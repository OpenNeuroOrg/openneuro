import createClient, { testDsId } from '../client'
import { getDataset, getDatasets, createDataset } from '../datasets'

jest.mock('../client')

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
  describe('getDataset query', () => {
    it('returns multiple datasets', done => {
      gqlClient
        .query({ query: getDatasets })
        .then(({ data: { datasets } }) => {
          expect(datasets).toHaveLength(2)
          // Make sure the array is Dataset objects
          expect(datasets[0]).toHaveProperty('__typename', 'Dataset')
        })
        .then(done)
    })
  })
  describe('createDataset mutation', () => {
    it('creates a dataset', done => {
      gqlClient
        .mutate({ mutation: createDataset, variables: { label: 'test-label' } })
        .then(({ data: { createDataset } }) => {
          expect(createDataset.__typename).toBe('Dataset')
        })
        .then(done)
    })
  })
})

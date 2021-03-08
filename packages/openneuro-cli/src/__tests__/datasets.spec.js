import { getDataset, createDataset } from '../datasets'

describe('datasets.js', () => {
  describe('createDataset', () => {
    it('calls createDataset when no datasetId is provided', done => {
      const client = {
        mutate: jest.fn(() =>
          Promise.resolve({ data: { createDataset: { id: 'testid' } } }),
        ),
      }
      createDataset(client)({ affirmedDefaced: true, affirmedConsent: false })
        .then(() => expect(client.mutate).toHaveBeenCalledTimes(1))
        .then(done)
    })
  })
  describe('getDataset', () => {
    it('queries for a dataset when passed a dataset id', done => {
      const client = {
        mutate: jest.fn(),
        query: jest.fn(() =>
          Promise.resolve({ data: { createDataset: { id: 'testid' } } }),
        ),
      }
      getDataset(client, 'test dataset', 'ds42')
        .then(dsId => {
          expect(dsId).toBe('ds42')
          expect(client.mutate).not.toHaveBeenCalled()
          expect(client.query).toHaveBeenCalled()
        })
        .then(done)
    })
  })
})

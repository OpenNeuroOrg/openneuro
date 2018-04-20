import { getOrCreateDataset } from '../datasets'

describe('datasets.js', () => {
  describe('getOrCreateDataset', () => {
    it('calls createDataset when no datasetId is provided', done => {
      const client = {
        mutate: jest.fn(() =>
          Promise.resolve({ data: { createDataset: { id: 'testid' } } }),
        ),
      }
      getOrCreateDataset(client, 'test dataset', undefined)
        .then(() => expect(client.mutate).toHaveBeenCalledTimes(1))
        .then(done)
    })
    it('does not call createDataset when passed a dataset id', done => {
      const client = { mutate: jest.fn() }
      getOrCreateDataset(client, 'test dataset', 'ds42')
        .then(dsId => {
          expect(dsId).toBe('ds42')
          expect(client.mutate).not.toHaveBeenCalled()
        })
        .then(done)
    })
  })
})

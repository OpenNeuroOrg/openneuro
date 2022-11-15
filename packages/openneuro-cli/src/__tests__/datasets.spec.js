import { getDataset, createDataset } from '../datasets'

describe('datasets.js', () => {
  describe('createDataset', () => {
    it('calls createDataset when no datasetId is provided', async () => {
      const client = {
        mutate: vi.fn(() =>
          Promise.resolve({ data: { createDataset: { id: 'testid' } } }),
        ),
      }
      await createDataset(client)({
        affirmedDefaced: true,
        affirmedConsent: false,
      }).then(() => expect(client.mutate).toHaveBeenCalledTimes(1))
    })
  })
  describe('getDataset', () => {
    it('queries for a dataset when passed a dataset id', () => {
      const client = {
        mutate: vi.fn(),
        query: vi.fn(() =>
          Promise.resolve({ data: { createDataset: { id: 'testid' } } }),
        ),
      }
      return getDataset(client, 'test dataset', 'ds42').then(dsId => {
        expect(dsId).toBe('ds42')
        expect(client.mutate).not.toHaveBeenCalled()
        expect(client.query).toHaveBeenCalled()
      })
    })
  })
})

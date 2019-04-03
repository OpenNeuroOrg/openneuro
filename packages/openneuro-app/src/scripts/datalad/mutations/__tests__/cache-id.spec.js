import { datasetCacheId } from '../cache-id.js'

describe('Mutation cache ids', () => {
  describe('datasetCacheId()', () => {
    it('returns the expected cache id for a dataset', () => {
      expect(datasetCacheId('ds000005')).toEqual('Dataset:ds000005')
    })
  })
})

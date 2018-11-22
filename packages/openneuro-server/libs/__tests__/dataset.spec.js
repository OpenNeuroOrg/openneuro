import mockingoose from 'mockingoose'
import { getAccessionNumber } from '../dataset.js'

describe('libs/dataset.js', () => {
  describe('getAccessionNumber', () => {
    beforeEach(() => {
      mockingoose.resetAll()
    })
    it('returns strings starting with "ds"', async () => {
      mockingoose.Counter.toReturn(
        { _id: 'dataset', sequence_value: 2 },
        'findOneAndUpdate',
      )
      const ds = await getAccessionNumber()
      expect(ds.slice(0, 2)).toEqual('ds')
    })
    it('generates sequential numbers', async () => {
      mockingoose.Counter.toReturn(
        { _id: 'dataset', sequence_value: 2 },
        'findOneAndUpdate',
      )
      const first = await getAccessionNumber()
      mockingoose.Counter.toReturn(
        { _id: 'dataset', sequence_value: 3 },
        'findOneAndUpdate',
      )
      const second = await getAccessionNumber()
      const fNum = parseInt(first.slice(2))
      const sNum = parseInt(second.slice(2))
      expect(fNum).toBeLessThan(sNum)
    })
    it('returns 6 digits for ds ids', async () => {
      mockingoose.Counter.toReturn(
        { _id: 'dataset', sequence_value: 2 },
        'findOneAndUpdate',
      )
      const ds = await getAccessionNumber()
      const num = ds.slice(2)
      expect(num).toHaveLength(6)
      expect(parseInt(num))
    })
  })
})

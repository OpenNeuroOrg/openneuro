import mongo from '../mongo'
import { getAccessionNumber } from '../dataset'

beforeAll(async () => {
  await mongo.connect()
  await mongo.collections.crn.counters.insertMany([
    { _id: 'datasets', sequence_value: 1 },
  ])
})

afterAll(async () => {
  // Reset
  mongo.collections.crn.counters.length = 0
})

describe('util/dataset.js', () => {
  describe('getAccessionNumber', () => {
    it('returns strings starting with "ds"', async () => {
      const ds = await getAccessionNumber()
      expect(ds.slice(0, 2)).toEqual('ds')
    })
    it('generates sequential numbers', async () => {
      const first = await getAccessionNumber()
      const second = await getAccessionNumber()
      const fNum = parseInt(first.slice(2))
      const sNum = parseInt(second.slice(2))
      expect(fNum).toBeLessThan(sNum)
    })
    it('returns 6 digits for ds ids', async () => {
      const ds = await getAccessionNumber()
      const num = ds.slice(2)
      expect(num).toHaveLength(6)
      expect(parseInt(num))
    })
  })
})

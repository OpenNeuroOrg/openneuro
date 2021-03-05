import mockingoose from 'mockingoose'
import * as ds from '../dataset'

jest.mock('../../../config.js')

describe('dataset resolvers', () => {
  beforeEach(() => {
    mockingoose.resetAll()
    mockingoose.Counter.toReturn(
      { _id: 'dataset', sequence_value: 1 }, // eslint-disable-line @typescript-eslint/camelcase
      'findOneAndUpdate',
    )
  })
  describe('createDataset()', () => {
    it('createDataset mutation succeeds', async done => {
      const { id: dsId } = await ds.createDataset(
        null,
        { affirmedDefaced: true, affirmedConsent: false },
        { user: '123456', userInfo: {} },
      )
      expect(dsId).toEqual(expect.stringMatching(/^ds[0-9]{6}$/))
      done()
    })
  })
  describe('snapshotCreationComparison()', () => {
    it('sorts array of objects by the "created" property', () => {
      const testArray = [
        { id: 2, created: new Date('2018-11-20T00:05:43.473Z') },
        { id: 1, created: new Date('2018-11-19T00:05:43.473Z') },
        { id: 3, created: new Date('2018-11-23T00:05:43.473Z') },
      ]
      const sorted = testArray.sort(ds.snapshotCreationComparison)
      expect(sorted[0].id).toBe(1)
      expect(sorted[1].id).toBe(2)
      expect(sorted[2].id).toBe(3)
    })
    it('sorts array of objects by the "created" property as strings', () => {
      const testArray = [
        { id: 2, created: '2018-11-20T00:05:43.473Z' },
        { id: 1, created: '2018-11-19T00:05:43.473Z' },
        { id: 3, created: '2018-11-23T00:05:43.473Z' },
      ]
      const sorted = testArray.sort(ds.snapshotCreationComparison)
      expect(sorted[0].id).toBe(1)
      expect(sorted[1].id).toBe(2)
      expect(sorted[2].id).toBe(3)
    })
  })
})

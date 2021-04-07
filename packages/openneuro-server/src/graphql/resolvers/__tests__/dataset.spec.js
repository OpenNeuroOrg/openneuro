import mockingoose from 'mockingoose'
import request from 'superagent'
import * as ds from '../dataset'

jest.mock('superagent')
jest.mock('../../../config.js')
jest.mock('../../../libs/notifications.js')

describe('dataset resolvers', () => {
  beforeEach(() => {
    mockingoose.resetAll()
    mockingoose.Counter.toReturn(
      { _id: 'dataset', sequence_value: 1 },
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
  describe('deleteFiles', () => {
    beforeEach(() => {
      mockingoose.resetAll()
      request.post.mockClear()
    })
    it('makes correct delete call to datalad', done => {
      // pass checkDatasetExists()
      mockingoose.Dataset.toReturn(true, 'count')
      // capture and check datalad delete request
      request.del = url => ({
        query: ({ recursive }) => ({
          set: (header1, headerValue1) => ({
            set: async () => {
              expect(url).toEqual(
                'http://datalad-0/datasets/ds999999/files/:sub-99',
              )
              expect(recursive).toBe(true)
              expect(header1).toEqual('Cookie')
              expect(headerValue1).toMatch(/^accessToken=/)
            },
          }),
        }),
      })

      ds.deleteFiles(
        null,
        { datasetId: 'ds999999', path: '/sub-99' },
        {
          user: 'a_user_id',
          userInfo: {
            // bypass permission checks
            admin: true,
          },
        },
      ).then(() => done())
    })
  })
})

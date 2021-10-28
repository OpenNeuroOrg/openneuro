import mockingoose from 'mockingoose'
import request from 'superagent'
import * as ds from '../dataset'

jest.mock('superagent')
jest.mock('ioredis')
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
    it('sorts array of objects by the "created" and "tag" properties', () => {
      const testArray = [
        { id: 2, created: new Date('2018-11-20T00:05:43.473Z'), tag: '1.0.0' },
        { id: 1, created: new Date('2018-11-19T00:05:43.473Z'), tag: '1.0.1' },
        { id: 3, created: new Date('2018-11-23T00:05:43.473Z'), tag: '1.0.2' },
        { id: 5, created: new Date('2018-11-23T00:05:43.473Z'), tag: '1.0.10' },
        { id: 4, created: new Date('2018-11-23T00:05:43.473Z'), tag: '1.0.3' },
      ]
      const sorted = testArray.sort(ds.snapshotCreationComparison)
      expect(sorted[0].id).toBe(1)
      expect(sorted[1].id).toBe(2)
      expect(sorted[2].id).toBe(3)
      expect(sorted[3].id).toBe(4)
      expect(sorted[4].id).toBe(5)
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
    it('sorts non-semver tags mixed with semver tags', () => {
      const testArray = [
        { id: 2, created: new Date('2018-11-19T00:05:43.473Z'), tag: '1.0.2' },
        {
          id: 1,
          created: new Date('2018-11-19T00:05:43.473Z'),
          tag: '57fed018cce88d000ac1757f',
        },
        { id: 3, created: new Date('2018-11-19T00:05:43.473Z'), tag: '1.0.1' },
      ]
      const sorted = testArray.sort(ds.snapshotCreationComparison)
      expect(sorted[0].id).toBe(2)
      expect(sorted[1].id).toBe(1)
      expect(sorted[2].id).toBe(3)
    })
    it('sorts snapshots with only non-semver tags', () => {
      const testArray = [
        {
          id: 2,
          created: new Date('2018-11-19T00:05:43.473Z'),
          tag: '00001',
        },
        {
          id: 1,
          created: new Date('2018-11-19T00:05:43.473Z'),
          tag: '57fed018cce88d000ac1757f',
        },
        {
          id: 3,
          created: new Date('2018-11-19T00:05:43.473Z'),
          tag: '57fed018cce88d000ac1757f',
        },
      ]
      const sorted = testArray.sort(ds.snapshotCreationComparison)
      expect(sorted[0].id).toBe(2)
      expect(sorted[1].id).toBe(1)
      expect(sorted[2].id).toBe(3)
    })
    it('sorts very similar creation times by semver order', () => {
      const testSnapshots = [
        {
          id: 'ds002680:1.0.0',
          created: '2020-04-03T23:19:56.000Z',
          tag: '1.0.0',
        },
        {
          id: 'ds002680:1.2.0',
          created: '2021-10-19T16:26:43.000Z',
          tag: '1.2.0',
        },
        {
          id: 'ds002680:1.1.0',
          created: '2021-10-19T16:26:44.000Z',
          tag: '1.1.0',
        },
      ]
      const sorted = testSnapshots.sort(ds.snapshotCreationComparison)
      expect(sorted[0].id).toBe('ds002680:1.0.0')
      expect(sorted[1].id).toBe('ds002680:1.1.0')
      expect(sorted[2].id).toBe('ds002680:1.2.0')
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
        set: (header1, headerValue1) => ({
          set: () => ({
            send: ({ filenames }) => {
              expect(url).toEqual('http://datalad-0/datasets/ds999999/files')
              expect(filenames).toEqual([':sub-99'])
              expect(header1).toEqual('Cookie')
              expect(headerValue1).toMatch(/^accessToken=/)
            },
          }),
        }),
      })

      ds.deleteFiles(
        null,
        { datasetId: 'ds999999', files: [{ path: '/sub-99' }] },
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

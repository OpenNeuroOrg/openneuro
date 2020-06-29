import mockingoose from 'mockingoose'
import * as pagination from '../pagination.js'
import { Types } from 'mongoose'
const ObjectID = Types.ObjectId

const base64 = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/

describe('pagination model operations', () => {
  describe('enumToMongoSort()', () => {
    it('should convert enum strings to -1 or 1 values', () => {
      expect(
        pagination.enumToMongoSort({
          created: 'descending',
          name: 'ascending',
        }),
      ).toEqual({ created: -1, name: 1 })
    })
  })
  describe('apiCursor()', () => {
    it('returns base64 string', () => {
      expect(pagination.apiCursor(ObjectID(5))).toMatch(base64)
    })
  })
  describe('applyCursorToEdges()', () => {
    it('returns the correct shape matching Relay connections', () => {
      const res = pagination.applyCursorToEdges(
        [{ _id: '123' }, { _id: '234' }, { _id: '345' }],
        0,
      )
      expect(res).toEqual([
        { cursor: 'eyJvZmZzZXQiOjB9', node: { _id: '123' } },
        { cursor: 'eyJvZmZzZXQiOjF9', node: { _id: '234' } },
        { cursor: 'eyJvZmZzZXQiOjJ9', node: { _id: '345' } },
      ])
    })
  })
  describe('datasetsConnection()', () => {
    beforeEach(() => {
      mockingoose.resetAll()
      mockingoose.Dataset.toReturn(
        [
          {
            datasets: [
              {
                _id: ObjectID('5bef51a1ed211400c08e5524'),
                id: 'ds001001',
                created: new Date('2018-11-16T23:24:17.203Z'),
                modified: new Date('2018-11-16T23:24:25.050Z'),
                uploader: 'f8d5a57c-879a-40e6-b151-e34c4a28ff70',
                revision: '262a8e610e32b5766cbf669acc71911c1ece7126',
              },
            ],
            count: 1,
          },
        ],
        'aggregate',
      )
    })
    it('returns a connection shaped result', async done => {
      const res = await pagination.datasetsConnection({
        orderBy: { created: 'ascending' },
        limit: 5,
      })([])
      expect(res).toHaveProperty('pageInfo')
      expect(res).toHaveProperty('edges')
      done()
    })
  })
  describe('maxLimit()', () => {
    it('should be within range 1-100', () => {
      expect(pagination.maxLimit(0)).toBe(1)
      expect(pagination.maxLimit(101)).toBe(100)
    })
    it('does not error with negative values', () => {
      expect(pagination.maxLimit(-10)).toBe(1)
    })
  })
  describe('sortAggregate()', () => {
    it('should return natural sort for orderBy: created', () => {
      expect(
        pagination.sortAggregate({ orderBy: { created: 'ascending' } }),
      ).toEqual([{ $sort: { _id: 1 } }])
    })
    it('does not throw an error with no orderBy', () => {
      expect(pagination.sortAggregate({})).toEqual([])
    })
    it('should return -1 for descending sorts', () => {
      expect(
        pagination.sortAggregate({ orderBy: { created: 'descending' } }),
      ).toEqual([{ $sort: { _id: -1 } }])
    })
    it('includes "name" for name sorts', () => {
      expect(
        pagination.sortAggregate({ orderBy: { name: 'descending' } }),
      ).toEqual([{ $sort: { name: -1 } }])
    })
    it('returns a lookup and count stage for stars', () => {
      const agg = pagination.sortAggregate({ orderBy: { stars: 'ascending' } })
      expect(agg[0]).toHaveProperty('$lookup')
      expect(agg[1]).toHaveProperty('$addFields')
      // Ends with count sort
      expect(agg.slice(-1)).toEqual([{ $sort: { starsCount: 1 } }])
    })
    it('returns a lookup and count stage for subscriptions', () => {
      const agg = pagination.sortAggregate({
        orderBy: { subscriptions: 'descending' },
      })
      expect(agg[0]).toHaveProperty('$lookup')
      expect(agg[1]).toHaveProperty('$addFields')
      // Ends with count sort
      expect(agg.slice(-1)).toEqual([{ $sort: { subscriptionsCount: -1 } }])
    })
    it('returns a lookup and no count stage for downloads', () => {
      const agg = pagination.sortAggregate({
        orderBy: { downloads: 'ascending' },
      })
      expect(agg[0]).toHaveProperty('$lookup')
      expect(agg[1]).not.toHaveProperty('$addFields')
      // Ends with count sort
      expect(agg.slice(-1)).toEqual([{ $sort: { downloads: 1 } }])
    })
    it('returns a lookup and no count stage for views', () => {
      const agg = pagination.sortAggregate({
        orderBy: { views: 'ascending' },
      })
      expect(agg[0]).toHaveProperty('$lookup')
      expect(agg[1]).not.toHaveProperty('$addFields')
      // Ends with count sort
      expect(agg.slice(-1)).toEqual([{ $sort: { views: 1 } }])
    })
    it('does not explode with all sorts', () => {
      const agg = pagination.sortAggregate({
        orderBy: {
          created: 'ascending',
          name: 'ascending',
          uploader: 'ascending',
          stars: 'ascending',
          downloads: 'ascending',
          subscriptions: 'ascending',
        },
      })
      expect(agg).toHaveLength(9)
      // Final stage should always be a sort
      expect(agg.slice(-1)[0]).toHaveProperty('$sort')
    })
  })
})

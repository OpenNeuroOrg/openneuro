import { ObjectID } from 'mongodb'
import mockingoose from 'mockingoose'
import Dataset from '../../models/dataset.js'
import * as pagination from '../pagination.js'
import config from '../../config.js'

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
      const res = pagination.applyCursorToEdges([
        { _id: '123' },
        { _id: '234' },
        { _id: '345' },
      ])
      expect(res).toEqual([
        { cursor: 'MTIz', node: { _id: '123' } },
        { cursor: 'MjM0', node: { _id: '234' } },
        { cursor: 'MzQ1', node: { _id: '345' } },
      ])
    })
  })
  describe('datasetsConnection()', () => {
    beforeEach(() => {
      mockingoose.resetAll()
      mockingoose.Dataset.toReturn(
        [
          {
            _id: ObjectID('5bef51a1ed211400c08e5524'),
            id: 'ds001001',
            created: new Date('2018-11-16T23:24:17.203Z'),
            modified: new Date('2018-11-16T23:24:25.050Z'),
            uploader: 'f8d5a57c-879a-40e6-b151-e34c4a28ff70',
            revision: '262a8e610e32b5766cbf669acc71911c1ece7126',
          },
        ],
        'find',
      )
    })
    it('returns a connection shaped result', async done => {
      const query = () => Dataset.find()
      const res = await pagination.datasetsConnection(query, {
        orderBy: { created: 'ascending' },
        limit: 5,
      })
      expect(res).toHaveProperty('pageInfo')
      expect(res).toHaveProperty('edges')
      done()
    })
  })
})

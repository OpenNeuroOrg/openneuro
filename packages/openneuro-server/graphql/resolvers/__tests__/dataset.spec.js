/**
 * @jest-environment ./mongo-environment.js
 */
import mongo from '../../../libs/mongo'
import * as ds from '../dataset'

beforeAll(async () => {
  await mongo.connect(global.__MONGO_URI__)
})

afterAll(async () => {
  await mongo.shutdown()
})

describe('dataset resolvers', () => {
  describe('createDataset()', () => {
    it('createDataset mutation succeeds', async done => {
      const { id: dsId } = await ds.createDataset(
        null,
        {
          label: 'testing dataset',
        },
        { user: {}, userInfo: { firstname: 'test', lastname: 'last' } },
      )
      expect(dsId).toEqual(expect.stringMatching(/^ds[0-9]{6}$/))
      done()
    })
  })
})

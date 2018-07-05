import mongo from '../../../libs/mongo'
import * as ds from '../dataset'

beforeAll(async () => {
  await mongo.connect()
  await mongo.collections.crn.counters.insertMany([
    { _id: 'datasets', sequence_value: 1 },
  ])
})

describe('dataset resolvers', () => {
  describe('createDataset()', () => {
    it('createDataset mutation succeeds', async done => {
      const { id: dsId } = await ds.createDataset(
        null,
        {
          label: 'testing dataset',
        },
        { user: {}, userInfo: { name: 'test' } },
      )
      expect(dsId).toEqual(expect.stringMatching(/^ds[0-9]{6}$/))
      done()
    })
  })
})

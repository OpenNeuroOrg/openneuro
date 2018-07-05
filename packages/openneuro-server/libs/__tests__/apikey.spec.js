import crypto from 'crypto'
import mongo from '../mongo'
import { generateApiKey } from '../apikey.js'

jest.mock('../../config.js')

const veryRandomByte = '4'
const userMock = {
  id: '1337',
  name: 'Total Poser',
  email: 'porkchopsandwich@gijoe.com',
  admin: true,
  provider: 'google',
}

beforeAll(async () => {
  await mongo.connect()
  mongo.collections.crn.keys.insertMany([
    { id: '1234-5678', hash: 'workaround-upsert-empty-mock' },
  ])
  crypto.randomBytes = (size, cb) => {
    const gen = Buffer.from(veryRandomByte.repeat(size))
    if (cb) {
      return cb(null, gen)
    } else {
      return gen
    }
  }
})

afterAll(async () => {
  await mongo.shutdown()
})

describe('util/apikey.js', () => {
  describe('generateApiKey', () => {
    it('returns an API key', async () => {
      const { key } = await generateApiKey(userMock)
      expect(key)
    })
  })
})

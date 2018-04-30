/**
 * @jest-environment ./mongo-environment.js
 */
import crypto from 'crypto'
import mongo from '../mongo'
import { generateApiKey, getUserIdFromApiKey } from '../apikey.js'

const veryRandomByte = '4'

beforeAll(async () => {
  await mongo.connect(global.__MONGO_URI__)
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
      const { key, hash } = await generateApiKey('1234-5678')
      expect(key).toBe(
        'JDJiJDEyJExCT3lMQk95TEJPeUxCT3lMQk95TC46MzQzNDM0MzQtMzQzNC00NDM0LWI0MzQtMzQzNDM0MzQzNDM0',
      )
      expect(hash).toBe(
        '$2b$12$LBOyLBOyLBOyLBOyLBOyL.Asu7taW81YymSTs8bAUEbuFqliekFEe',
      )
    })
  })
  describe('getUserIdFromApiKey', () => {
    it('returns the right user id', async () => {
      const userId = '1234-5678'
      const { key } = await generateApiKey(userId)
      const fromApiKey = await getUserIdFromApiKey(key)
      expect(fromApiKey).toBe(userId)
    })
  })
})

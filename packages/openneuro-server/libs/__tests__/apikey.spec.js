/**
 * @jest-environment ./mongo-environment.js
 */
import crypto from 'crypto'
import mongo from '../mongo'
import { generateApiKey, getUserIdFromApiKey } from '../apikey.js'

const veryRandomString = '44444444444444444444444444444444'

beforeAll(async () => {
  await mongo.connect(global.__MONGO_URI__)
  crypto.randomBytes = () => veryRandomString
})

afterAll(async () => {
  await mongo.shutdown()
})

describe('util/apikey.js', () => {
  describe('generateApiKey', () => {
    it('returns an API key', async () => {
      const { key, hash } = await generateApiKey('1234-5678')
      expect(key).toBe(veryRandomString)
      expect(hash).toBe(
        '$2a$10$/.OC/.OC/.OC/.OC/.OC/.omYap8w9G1LnHRQvuCZROkPgWNPD96u',
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

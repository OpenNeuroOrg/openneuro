import jwt from 'jsonwebtoken'
import { apiKeyFactory } from '../apikey.js'
import config from '../../config.js'

jest.mock('../../config.js')

const userMock = {
  id: '1337',
  name: 'Total Poser',
  email: 'porkchopsandwich@gijoe.com',
  admin: true,
  provider: 'google',
}

describe('util/apikey.js', () => {
  describe('apiKeyFactory', () => {
    it('produces a valid JWT', () => {
      const token = jwt.verify(apiKeyFactory(userMock), config.auth.jwt.secret)
      expect(token.sub).toEqual(userMock.id)
      expect(token.email).toEqual(userMock.email)
    })
  })
})

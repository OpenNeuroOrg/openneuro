import User from '../../../models/user.js'
import { addJWT } from '../jwt.js'

jest.mock('../../../config.js')

describe('jwt auth', () => {
  describe('addJWT()', () => {
    it('Extends a User model with a valid token', () => {
      const config = {
        auth: {
          jwt: {
            secret: '1234',
          },
        },
      }
      const user = User({ email: 'test@example.com' })
      const obj = addJWT(config)(user)
      expect(obj).toHaveProperty('token')
    })
  })
})

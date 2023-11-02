import { vi } from 'vitest'
import User from '../../../models/user'
import { addJWT } from '../jwt'

vi.mock('ioredis')
vi.mock('../../../config.ts')
vi.unmock('mongoose')

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

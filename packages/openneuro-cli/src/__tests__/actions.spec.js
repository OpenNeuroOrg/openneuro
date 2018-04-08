import { login, upload, diff } from '../actions.js'

describe('commands.js', () => {
  describe('login', () => {
    it('should accept an auth key', () => {
      const apiKey = '123456'
      login(apiKey)
    })
  })
})

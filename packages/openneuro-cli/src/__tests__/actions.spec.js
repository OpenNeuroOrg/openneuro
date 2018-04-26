import { loginAnswers } from '../actions.js'

describe('actions.js', () => {
  describe('login', () => {
    const testKey = '123456'
    it('should accept an auth key', () => {
      loginAnswers({ apikey: testKey })
    })
  })
})

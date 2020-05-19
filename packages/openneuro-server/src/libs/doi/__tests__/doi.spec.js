import { formatBasicAuth } from '../index.js'

describe('DOI minting utils', () => {
  describe('auth()', () => {
    it('returns a base64 basic auth string', () => {
      const doiConfig = { username: 'test', password: '12345' }
      expect(formatBasicAuth(doiConfig)).toBe('Basic dGVzdDoxMjM0NQ==')
    })
  })
})

import { template, formatBasicAuth } from '../index.js'

describe('DOI minting utils', () => {
  describe('auth()', () => {
    it('returns a base64 basic auth string', () => {
      const doiConfig = { username: 'test', password: '12345' }
      expect(formatBasicAuth(doiConfig)).toBe('Basic dGVzdDoxMjM0NQ==')
    })
  })
  describe('template()', () => {
    it('accepts expected arguments', () => {
      const context = {
        doi: '12345',
        creators: ['A. User', 'B. User'],
        title: 'Test Dataset',
        year: '1999',
        resourceType: 'fMRI',
      }
      expect(template(context)).toMatchSnapshot()
    })
  })
})

import { createClient, middlewareAuthLink } from '../client.js'

describe('API client', () => {
  describe('createClient', () => {
    it('setup a link given basic options', () => {
      expect(() => {
        createClient('http://does-not-exist-tld')
      }).not.toThrowError()
    })
  })
  describe('middlewareAuthLink()', () => {
    it('creates an anonymous upload link given no getAuthorization option', () => {
      expect(
        middlewareAuthLink('http://does-not-exist-tld').constructor.name,
      ).toBe('ApolloLink')
    })
  })
})

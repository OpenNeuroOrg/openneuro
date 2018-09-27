import { fetchAlternates } from '../dataset.js'

describe('service worker - dataset metadata', () => {
  describe('fetchAlternates', () => {
    it('returns a promise', () => {
      const mockResponse = {
        ok: true,
      }
      // Mock the fetch call
      global.fetch = jest.fn(() => Promise.resolve(mockResponse))
      const testUrls = ['http://localhost/1', 'http://localhost/2']
      return expect(fetchAlternates(testUrls)).resolves.toEqual(mockResponse)
    })
    it('returns the first url when successful', () => {
      const url1 = 'http://localhost/1'
      const url2 = 'http://localhost/2'
      const mockResponse = {
        ok: true,
      }
      // Mock the fetch call
      global.fetch = jest.fn(fetchedUrl => {
        const response = Object.create(mockResponse)
        response.url = fetchedUrl
        return Promise.resolve(response)
      })
      const testUrls = [url1, url2]
      return expect(fetchAlternates(testUrls)).resolves.toHaveProperty(
        'url',
        url1,
      )
    })
    it('returns the second url when the first fails', () => {
      const url1 = 'http://localhost/1'
      const url2 = 'http://localhost/2'
      const mockResponse = {
        ok: true,
      }
      // Mock the fetch call
      global.fetch = jest.fn(fetchedUrl => {
        const response = Object.create(mockResponse)
        // Return ok on the second URL
        response.ok = fetchedUrl === url2
        response.url = fetchedUrl
        return Promise.resolve(response)
      })
      const testUrls = [url1, url2]
      return expect(fetchAlternates(testUrls)).resolves.toHaveProperty(
        'url',
        url2,
      )
    })
    it('throws an error if all URLs fail', () => {
      const mockResponse = {
        ok: true,
      }
      // Mock the fetch call
      global.fetch = jest.fn(fetchedUrl => {
        const response = Object.create(mockResponse)
        response.ok = false
        response.url = fetchedUrl
        return Promise.resolve(response)
      })
      const url1 = 'http://localhost/1'
      const url2 = 'http://localhost/2'
      const testUrls = [url1, url2]
      return expect(fetchAlternates(testUrls)).rejects.toThrow()
    })
  })
})

import {
  downloadUrl,
  checkDestination,
  getDownloadMetadata,
} from '../download.js'

jest.mock('../config.js')

let errorSpy
let dirSpy

beforeEach(() => {
  errorSpy = jest.spyOn(console, 'error').mockImplementation()
  dirSpy = jest.spyOn(console, 'dir').mockImplementation()
})
afterEach(() => {
  errorSpy.mockRestore()
  dirSpy.mockRestore()
})

describe('download.js', () => {
  describe('downloadUrl()', () => {
    it('returns snapshot url with tag arg', () => {
      expect(downloadUrl('http://localhost:9876/', 'ds000001', '1.0.0')).toBe(
        'http://localhost:9876/crn/datasets/ds000001/snapshots/1.0.0/download',
      )
    })
    it('returns a draft url with no tag arg', () => {
      expect(downloadUrl('http://localhost:9876/', 'ds000001', undefined)).toBe(
        'http://localhost:9876/crn/datasets/ds000001/download',
      )
    })
  })
  describe('checkDestination()', () => {
    it('throws an error on existing directories', () => {
      expect(checkDestination('.')).toThrowErrorMatchingSnapshot()
    })
  })
  describe('getDownloadMetadata()', () => {
    it('fetches metdata on successful fetch', async () => {
      fetch.mockResponseOnce(JSON.stringify({}))
      await getDownloadMetadata('ds000testing', '1.0.0')
      expect(fetch).toHaveBeenCalledTimes(1)
    })
    it('returns an error message on rejected fetch', async () => {
      const testError = { testError: true }
      fetch.mockReject(testError)
      await getDownloadMetadata('ds000testing', '1.0.0')
      expect(console.error).toHaveBeenCalledWith(
        'Error starting download - please check your connection or try again later',
      )
      expect(console.dir).toHaveBeenCalledWith(testError)
    })
  })
})

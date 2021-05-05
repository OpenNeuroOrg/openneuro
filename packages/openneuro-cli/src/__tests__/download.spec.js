import { downloadUrl, checkDestination } from '../download.js'

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
      expect(() =>
        checkDestination('package.json'),
      ).toThrowErrorMatchingSnapshot()
    })
  })
})

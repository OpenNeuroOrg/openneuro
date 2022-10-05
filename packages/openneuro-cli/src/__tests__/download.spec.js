import { checkDestination } from '../download.js'

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
  describe('checkDestination()', () => {
    it('throws an error on existing directories', () => {
      expect(() =>
        checkDestination('package.json'),
      ).toThrowErrorMatchingSnapshot()
    })
  })
})

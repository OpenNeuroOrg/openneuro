import {
  filesKey,
  encodeFilePath,
  decodeFilePath,
  fileUrl,
  objectUrl,
} from '../files.js'

jest.mock('../../config.js')

const filename = 'sub-01/anat/sub-01_T1w.nii.gz'

describe('datalad files', () => {
  describe('filesKey()', () => {
    it('encodes a valid cache key', () => {
      expect(
        filesKey('ds000001', '13582a0b2dc82b3644431ba54fd38926a5d2238f'),
      ).toBe(
        'openneuro:files:ds000001:13582a0b2dc82b3644431ba54fd38926a5d2238f',
      )
    })
  })
  describe('encodeFilePath()', () => {
    it('should encode a nested path', () => {
      expect(encodeFilePath(filename)).toBe('sub-01:anat:sub-01_T1w.nii.gz')
    })
  })
  describe('decodeFilePath()', () => {
    it('decodes a file path', () => {
      expect(decodeFilePath('sub-01:anat:sub-01_T1w.nii.gz')).toBe(filename)
    })
  })
  describe('fileUrl()', () => {
    it('returns a working URL', () => {
      expect(fileUrl('ds000001', '', filename)).toBe(
        'http://datalad:9877/datasets/ds000001/files/sub-01:anat:sub-01_T1w.nii.gz',
      )
    })
    it('handles path nesting', () => {
      expect(fileUrl('ds000001', 'sub-01/anat', 'sub-01_T1w.nii.gz')).toBe(
        'http://datalad:9877/datasets/ds000001/files/sub-01:anat:sub-01_T1w.nii.gz',
      )
    })
  })
  describe('objectUrl()', () => {
    it('returns a valid object URL', () => {
      expect(
        objectUrl('ds000001', '27c8552038d55201560e5501093d637b27e7fd4b'),
      ).toBe(
        'http://datalad:9877/datasets/ds000001/objects/27c8552038d55201560e5501093d637b27e7fd4b',
      )
    })
  })
})

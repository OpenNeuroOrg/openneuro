import {
  encodeFilePath,
  decodeFilePath,
  fileUrl,
  objectUrl,
  filterFiles,
} from '../files.js'

jest.mock('../../config.js')

const filename = 'sub-01/anat/sub-01_T1w.nii.gz'

const mockRootFiles = [
  { filename: 'README' },
  { filename: 'dataset_description.json' },
]
const mockSub01 = [
  { filename: 'sub-01/anat/sub-01_T1w.nii.gz' },
  { filename: 'sub-01/func/sub-01_task-onebacktask_run-01_bold.nii.gz' },
]
const mockSub02 = [
  { filename: 'sub-02/anat/sub-02_T1w.nii.gz' },
  { filename: 'sub-02/func/sub-02_task-onebacktask_run-01_bold.nii.gz' },
]
const mockSub03 = [
  { filename: 'sub-03/anat/sub-03_T1w.nii.gz' },
  { filename: 'sub-03/func/sub-03_task-onebacktask_run-01_bold.nii.gz' },
]
const mockDerivatives = [{ filename: 'derivatives/groundbreaking_output.html' }]
const mockFiles = [
  ...mockRootFiles,
  ...mockSub01,
  ...mockSub02,
  ...mockSub03,
  ...mockDerivatives,
]

describe('datalad files', () => {
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
        'http://datalad-0/datasets/ds000001/files/sub-01:anat:sub-01_T1w.nii.gz',
      )
    })
    it('handles path nesting', () => {
      expect(fileUrl('ds000001', 'sub-01/anat', 'sub-01_T1w.nii.gz')).toBe(
        'http://datalad-0/datasets/ds000001/files/sub-01:anat:sub-01_T1w.nii.gz',
      )
    })
  })
  describe('objectUrl()', () => {
    it('returns a valid object URL', () => {
      expect(
        objectUrl('ds000001', '27c8552038d55201560e5501093d637b27e7fd4b'),
      ).toBe(
        'http://datalad-0/datasets/ds000001/objects/27c8552038d55201560e5501093d637b27e7fd4b',
      )
    })
  })
  describe('filterFiles()', () => {
    it('disables the filter when set to null', () => {
      expect(filterFiles(null)(mockFiles)).toBe(mockFiles)
    })
    it("returns only root level files with '' filter", () => {
      const mockDirs = [
        {
          filename: 'sub-01',
          id: 'directory:sub-01',
          urls: [],
          size: 2,
          directory: true,
        },
        {
          filename: 'sub-02',
          id: 'directory:sub-02',
          urls: [],
          size: 2,
          directory: true,
        },
        {
          filename: 'sub-03',
          id: 'directory:sub-03',
          urls: [],
          size: 2,
          directory: true,
        },
        {
          filename: 'derivatives',
          id: 'directory:derivatives',
          urls: [],
          size: 1,
          directory: true,
        },
      ]
      expect(filterFiles('')(mockFiles)).toEqual([
        ...mockRootFiles,
        ...mockDirs,
      ])
    })
    it('returns only matching prefixed files with a directory name filter', () => {
      expect(filterFiles('sub-01')(mockFiles)).toEqual(mockSub01)
    })
    it('works correctly for deeply nested files', () => {
      expect(filterFiles('sub-01/func')(mockFiles)).toEqual([mockSub01[1]])
    })
  })
})

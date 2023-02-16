import { fileCacheDeleteFilter } from '../delete-file.jsx'

describe('DeleteFile mutation', () => {
  describe('fileCacheDeleteFilter', () => {
    const cachedFileObjects = []
    it('removes a matching file', () => {
      expect(
        fileCacheDeleteFilter(
          {
            id: 'DatasetFile:abcdef',
            key: 'cdefgh',
            filename: 'sub-01:anat:sub-01_T1w.nii.gz',
            directory: false,
          },
          'sub-01:anat',
          'sub-01_T1w.nii.gz',
          cachedFileObjects,
        ),
      ).toBe(false)
    })
    it('does not remove non-matching file', () => {
      expect(
        fileCacheDeleteFilter(
          {
            id: 'DatasetFile:abcdef',
            key: 'cdefgh',
            filename: 'sub-02:anat:sub-02_T1w.nii.gz',
            directory: false,
          },
          'sub-01:anat',
          'sub-01_T1w.nii.gz',
          cachedFileObjects,
        ),
      ).toBe(true)
    })
    it('removes a matching directory', () => {
      expect(
        fileCacheDeleteFilter(
          {
            id: 'DatasetFile:abcdef',
            key: 'cdefgh',
            filename: 'sub-01:anat',
            directory: true,
          },
          'sub-01:anat',
          '',
          cachedFileObjects,
        ),
      ).toBe(false)
    })
    it('does not remove non-empty directory', () => {
      expect(
        fileCacheDeleteFilter(
          {
            id: 'DatasetFile:abcdef',
            key: 'cdefgh',
            filename: 'sub-02:anat',
            directory: true,
          },
          '',
          'sub-02:anat:sub-02_T1w.json',
          [
            {
              id: 'DatasetFile:123456',
              key: 'cdefgh',
              filename: 'sub-02:anat:sub-02_T1w.nii.gz',
              directory: false,
            },
          ],
        ),
      ).toBe(true)
    })
    it('removes empty non-matching directories', () => {
      // This is also false because the directory has no files in cachedFileObjects
      expect(
        fileCacheDeleteFilter(
          {
            id: 'DatasetFile:abcdef',
            key: 'cdefgh',
            filename: 'sub-02:anat',
            directory: true,
          },
          'sub-01:anat',
          '',
          cachedFileObjects,
        ),
      ).toBe(false)
    })
  })
})

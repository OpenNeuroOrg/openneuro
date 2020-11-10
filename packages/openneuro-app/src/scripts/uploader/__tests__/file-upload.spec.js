import { getRelativePath, encodeFilePath } from '../file-upload.js'

describe('file upload helpers', () => {
  describe('getRelativePath', () => {
    it('works with a few directory levels', () => {
      expect(
        getRelativePath({ webkitRelativePath: 'test/paths/like/this' }),
      ).toBe('paths/like/this')
    })
    it('works if the path is not actually relative', () => {
      expect(
        getRelativePath({ webkitRelativePath: 'dataset_description.json' }),
      ).toBe('dataset_description.json')
    })
  })
  describe('encodeFilePath', () => {
    it('supports directory upload from a webkit-derived browser (stripRelativePath: true)', () => {
      expect(
        encodeFilePath(
          {
            name: 'sub-02_T1w.nii.gz',
            lastModified: 1604713385516,
            webkitRelativePath: 'dataset/sub-02/anat/sub-02_T1w.nii.gz',
            size: 311112,
            type: 'application/gzip',
          },
          { stripRelativePath: true },
        ),
      ).toEqual('sub-02:anat:sub-02_T1w.nii.gz')
    })
    it('supports directory upload from a webkit-derived browser (stripRelativePath: false)', () => {
      expect(
        encodeFilePath(
          {
            name: 'sub-02_T1w.nii.gz',
            lastModified: 1604713385516,
            webkitRelativePath: 'sub-02/anat/sub-02_T1w.nii.gz',
            size: 311112,
            type: 'application/gzip',
          },
          { stripRelativePath: false },
        ),
      ).toEqual('sub-02:anat:sub-02_T1w.nii.gz')
    })
    it('supports file upload from a webkit-derived browser (stripRelativePath: true)', () => {
      expect(
        encodeFilePath(
          {
            name: 'README',
            lastModified: 1604713385516,
            webkitRelativePath: '',
            size: 809,
            type: 'text/plain',
          },
          { stripRelativePath: true },
        ),
      ).toEqual('README')
    })
    it('supports file upload from a webkit-derived browser (stripRelativePath: false)', () => {
      expect(
        encodeFilePath(
          {
            name: 'README',
            lastModified: 1604713385516,
            webkitRelativePath: '',
            size: 809,
            type: 'text/plain',
          },
          { stripRelativePath: false },
        ),
      ).toEqual('README')
    })
    it('supports nested file upload from a webkit-derived browser (stripRelativePath: true)', () => {
      expect(
        encodeFilePath(
          {
            name: 'sub-02_T1w.nii.gz',
            lastModified: 1604713385516,
            webkitRelativePath: '/dataset/sub-02/anat/',
            size: 2000,
            type: 'text/plain',
          },
          { stripRelativePath: true },
        ),
      ).toEqual('sub-02:anat:sub-02_T1w.nii.gz')
    })
    it('supports nested file upload from a webkit-derived browser (stripRelativePath: false)', () => {
      expect(
        encodeFilePath(
          {
            name: 'sub-02_T1w.nii.gz',
            lastModified: 1604713385516,
            webkitRelativePath: '/sub-02/anat/',
            size: 2000,
            type: 'text/plain',
          },
          { stripRelativePath: false },
        ),
      ).toEqual('sub-02:anat:sub-02_T1w.nii.gz')
    })
    it('supports nested directory upload from a webkit-derived browser (stripRelativePath: false)', () => {
      expect(
        encodeFilePath(
          {
            name: 'sub-02_T1w.nii.gz',
            lastModified: 1604713385516,
            webkitRelativePath: '/sub-02/anat/sub-02_T1w.nii.gz',
            size: 2000,
            type: 'text/plain',
          },
          { stripRelativePath: false },
        ),
      ).toEqual('sub-02:anat:sub-02_T1w.nii.gz')
    })
  })
})

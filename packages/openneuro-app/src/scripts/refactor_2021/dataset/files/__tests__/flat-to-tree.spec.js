import { flatToTree } from '../flat-to-tree.js'

const CHANGES = Object.freeze({
  id: '3d9b15b3ef4e9da06e265e6078d3b4ddf8495102',
  filename: 'CHANGES',
  size: 39,
})

const nifti = Object.freeze({
  id: '50512c7261fc006eb59bfd16f2a9d3140c9efe62',
  filename: 'sub-01/anat/sub-01_T1w.nii.gz',
  size: 311112,
})

const sub01Unloaded = Object.freeze({
  id: 'directory:sub-01',
  filename: 'sub-01',
  size: 1,
  directory: true,
})

const exampleFiles = [CHANGES, nifti]

describe('FileTree', () => {
  describe('flatToTree()', () => {
    it('accepts an array and returns a tree', () => {
      expect(flatToTree(exampleFiles)).toEqual({
        name: '',
        files: [CHANGES],
        directories: [
          {
            name: 'sub-01',
            path: 'sub-01',
            files: [],
            directories: [
              {
                name: 'anat',
                path: 'sub-01:anat',
                files: [{ ...nifti, filename: 'sub-01_T1w.nii.gz' }],
                directories: [],
              },
            ],
          },
        ],
      })
    })
    it('accepts directory stubs and returns them as directories', () => {
      expect(flatToTree([CHANGES, sub01Unloaded])).toEqual({
        name: '',
        files: [CHANGES],
        directories: [{ ...sub01Unloaded, name: sub01Unloaded.filename }],
      })
    })
  })
})

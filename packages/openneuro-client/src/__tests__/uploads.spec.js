import { uploadSize, uploadParallelism, hashFileList } from '../uploads.js'

// Quick Mock for browser File
class File {
  constructor(content, fileName) {
    this.webkitRelativePath = '/' + fileName
    this.size = content.length
  }
}

describe('upload implementation', () => {
  describe('uploadSize()', () => {
    it('returns a size in bytes', () => {
      expect(uploadSize([{ size: 15 }, { size: 35 }, { size: 0 }])).toBe(50)
    })
  })
  describe('uploadParallelism()', () => {
    it('returns a minimum of 2', () => {
      expect(uploadParallelism([{ size: 10 }], 10)).toBe(2)
    })
    it('returns a maxium of 16', () => {
      expect(uploadParallelism([{ size: 1000000000000 }], 1000000000000)).toBe(
        16,
      )
    })
    it('returns a useful value in the middle for some datasets', () => {
      expect(
        uploadParallelism(
          [
            { size: 1048576 * 4 },
            { size: 1048576 * 3 },
            { size: 1048576 * 1 },
            { size: 1048576 * 12 },
            { size: 1048576 * 3 },
            { size: 1048576 * 24 },
            { size: 1048576 * 1 },
            { size: 1035 },
            { size: 104 },
            { size: 350 },
            { size: 3550 },
            { size: 35670 },
          ],
          50372357,
        ),
      ).toBe(8)
    })
    it('works correctly with a few small files', () => {
      expect(
        uploadParallelism(
          [{ size: 42 }, { size: 84 }, { size: 35 }, { size: 50 }],
          211,
        ),
      ).toBe(2)
    })
  })
  describe('hashFileList()', () => {
    it('works for node.js file arrays', () => {
      const fileList = [{ filename: 'dataset_description.json', size: 256 }]
      expect(hashFileList('ds000001', fileList)).toBe('27bb832a')
    })
    it('works for browser arrays of File objects', () => {
      const fileList = [
        new File('{"name": "Dataset"}', 'dataset_description.json'),
        new File('mock dataset', 'README'),
      ]
      expect(hashFileList('ds000001', fileList)).toBe('509a4d42')
    })
  })
})

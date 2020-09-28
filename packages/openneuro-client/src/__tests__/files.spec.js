import * as files from '../files'

jest.mock('../client')
jest.mock('../../../openneuro-server/src/config.js')

describe('files.js', () => {
  describe('sortFiles()', () => {
    it('sorts dataset_description to the first element', () => {
      const testFiles = [
        { path: 'Dataset/a' },
        { path: 'Dataset/b' },
        { path: 'Dataset/dataset_description.json' },
        { path: 'Dataset/c' },
      ]
      expect(files.sortFiles(testFiles)[0].path).toBe(
        'Dataset/dataset_description.json',
      )
    })
    it('works with browser files', () => {
      const testFiles = [
        { webkitRelativePath: 'Dataset/a' },
        { webkitRelativePath: 'Dataset/b' },
        { webkitRelativePath: 'Dataset/dataset_description.json' },
        { webkitRelativePath: 'Dataset/c' },
      ]
      expect(files.sortFiles(testFiles)[0].webkitRelativePath).toBe(
        'Dataset/dataset_description.json',
      )
    })
  })
})

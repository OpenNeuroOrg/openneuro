import { sortFiles } from '../upload.js'

describe('upload.js', () => {
  describe('sortFiles()', () => {
    it('sorts dataset_description to the first element', () => {
      const files = [
        { path: 'Dataset/a' },
        { path: 'Dataset/b' },
        { path: 'Dataset/dataset_description.json' },
        { path: 'Dataset/c' },
      ]
      expect(sortFiles(files)[0].path).toBe('Dataset/dataset_description.json')
    })
  })
})

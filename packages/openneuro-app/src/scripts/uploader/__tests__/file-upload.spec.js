import { getRelativePath } from '../file-upload.js'

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
})

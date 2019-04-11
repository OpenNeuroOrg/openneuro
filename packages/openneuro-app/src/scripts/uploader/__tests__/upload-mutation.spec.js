import { mkLevels, treeFromList } from '../upload-mutation.js'

describe('Uploader mutations', () => {
  describe('mkLevels', () => {
    it('updates the parent argument by pushing file objects', () => {
      const file = new Blob(['Trouble on Blobolonia'], { type: 'text/plain' })
      const parent = { files: [], directories: [], name: '' }
      mkLevels(file, parent, ['README'])
      expect(parent.files).toEqual([file])
      expect(parent.directories).toEqual([])
    })
    it('creates new directories for nested paths', () => {
      const file = new Blob(['1234'], { type: 'text/plain' })
      const parent = { files: [], directories: [], name: '' }
      mkLevels(file, parent, ['derivatives', 'README'])
      expect(parent.files).toEqual([])
      expect(parent.directories).toHaveLength(1)
      expect(parent.directories[0].files).toHaveLength(1)
      expect(parent.directories[0].files[0]).toEqual(file)
    })
    it('updates existing directories with newly found files', () => {
      const file = new Blob(['{}'], { type: 'application/json' })
      const parent = {
        files: [],
        directories: [{ name: 'derivatives', files: [], directories: [] }],
        name: '',
      }
      mkLevels(file, parent, ['derivatives', 'data.json'])
      expect(parent.files).toEqual([])
      expect(parent.directories).toHaveLength(1)
      expect(parent.directories[0].files).toHaveLength(1)
      expect(parent.directories[0].files[0]).toEqual(file)
    })
  })
  describe('treeFromList', () => {
    it('handles a tree from <input type="file" multiple />', () => {
      const mockFileA = new Blob(['file one'], { type: 'text/plain' })
      const mockFileB = new Blob(['file two'], { type: 'text/plain' })
      mockFileA.webkitRelativePath = '/'
      mockFileB.webkitRelativePath = '/'
      const mockFileList = [mockFileA, mockFileB]
      const fileTree = treeFromList(mockFileList)
      expect(typeof fileTree).toBe('object')
      expect(fileTree.directories).toEqual([])
      expect(fileTree.files).toHaveLength(2)
      expect(fileTree.name).toBe('')
    })
    it('should work for files without webkitRelativePath', () => {
      const mockFile = new Blob(['a boy and his blob'], { type: 'text/plain' })
      const mockFileList = [mockFile]
      const fileTree = treeFromList(mockFileList)
      expect(fileTree.directories).toEqual([])
      expect(fileTree.files).toHaveLength(1)
      expect(fileTree.name).toBe('')
    })
  })
})

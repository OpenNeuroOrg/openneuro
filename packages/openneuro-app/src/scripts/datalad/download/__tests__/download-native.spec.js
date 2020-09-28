import { openFileTree } from '../download-native.js'

describe('dataset/download - native file API method', () => {
  describe('openFileTree', () => {
    it('iterates over directory to correct depth', async () => {
      const mockDirectoryHandle = {}
      const mockFile = Symbol('mockFile')
      mockDirectoryHandle.getDirectoryHandle = jest.fn(
        () => mockDirectoryHandle,
      )
      mockDirectoryHandle.getFileHandle = jest.fn(() => mockFile)
      expect(
        await openFileTree(mockDirectoryHandle, 'sub-01/anat/something.nii.gz'),
      ).toBe(mockFile)
      expect(mockDirectoryHandle.getDirectoryHandle).toHaveBeenCalledTimes(2)
    })
  })
})

import fs from 'fs'
import path from 'path'
import * as files from '../files'

let tmpPath

// Must be require for Jest's implementation
jest.mock('fs', () => new (require('metro-memory-fs'))())

describe('files.js', () => {
  describe('getFileTree', () => {
    beforeEach(() => {
      require('fs').reset()
      tmpPath = '/testing'
      // Some directory complexity to test against
      fs.mkdirSync(tmpPath)
      fs.mkdirSync(path.join(tmpPath, 'dir'))
      fs.mkdirSync(path.join(tmpPath, 'dir/dir2'))
      fs.mkdirSync(path.join(tmpPath, 'dir3'))
      const testFiles = [
        'test',
        'test2',
        'dir/test3',
        'dir/dir2/test4',
        'dir3/test5',
      ]
      for (const filePath of testFiles) {
        fs.writeFileSync(path.join(tmpPath, filePath), filePath)
      }
    })
    it('should return a tree', done => {
      files
        .getFileTree(tmpPath, tmpPath)
        .then(tree => {
          expect(tree).toHaveProperty('files')
          expect(tree.files).toHaveLength(2)
          expect(tree).toHaveProperty('directories')
          expect(tree.directories).toHaveLength(2)
          expect(tree.directories[0]).toHaveProperty('directories')
          expect(tree.directories[0].files).toHaveLength(1)
        })
        .then(done)
    })
    it('should include relative directory names at each node', done => {
      files
        .getFileTree(tmpPath, tmpPath)
        .then(tree => {
          expect(tree).toHaveProperty('name')
          expect(tree.name).toBe('')
          expect(tree.directories[0].name).toBe('dir')
        })
        .then(done)
    })
  })
  describe('fileProgress', () => {
    it('returns a valid percentage', () => {
      const progress = files.fileProgress(
        { log: jest.fn() },
        'test',
        { bytesRead: 100 },
        200,
      )()
      expect(progress.percentage).toBe(50)
    })
    it('returns a correct remainingBytes', () => {
      const progress = files.fileProgress(
        { log: jest.fn() },
        'test',
        { bytesRead: 100 },
        200,
      )()
      expect(progress.remainingBytes).toBe(100)
    })
    it('formats status with all values', () => {
      const mockConsole = { log: jest.fn() }
      const progress = files.fileProgress(
        mockConsole,
        'test',
        { bytesRead: 100 },
        200,
      )()
      expect(mockConsole.log).toHaveBeenCalled()
      expect(mockConsole.log).toHaveBeenCalledWith(
        'Transferring "test" - 50% complete (100 Bytes) remaining)',
      )
    })
  })
})

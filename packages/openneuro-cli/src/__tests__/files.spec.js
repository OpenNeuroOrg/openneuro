import fs from 'fs'
import path from 'path'
import walk from 'walk-promise'
import * as files from '../files'

let tmpPath

// Must be require for Jest's implementation
jest.mock('fs', () => new (require('metro-memory-fs'))())

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

describe('files.js', () => {
  describe('streamFiles', () => {
    it('creates an array of streams and metadata', done => {
      walk(tmpPath)
        .then(files.streamFiles)
        .then(collected => {
          expect(collected).toHaveLength(5)
          // Check for the expected readable stream
          expect(typeof collected[0].read).toBe('function')
          expect(typeof collected[0].on).toBe('function')
          done()
        })
    })
  })
})

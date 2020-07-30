import os from 'os'
import fs from 'fs'
import path from 'path'
import * as files from '../files'

let tmpPath
const testFiles = ['test', 'test2', 'dir/test3', 'dir/dir2/test4', 'dir3/test5']

describe('files.js', () => {
  describe('getFileTree()', () => {
    beforeEach(() => {
      tmpPath = fs.mkdtempSync(path.join(os.tmpdir(), 'openneuro-cli-tests'))
      // Some directory complexity to test against
      fs.mkdirSync(path.join(tmpPath, 'dir'))
      fs.mkdirSync(path.join(tmpPath, 'dir/dir2'))
      fs.mkdirSync(path.join(tmpPath, 'dir3'))
      for (const filePath of testFiles) {
        fs.writeFileSync(path.join(tmpPath, filePath), filePath)
      }
    })
    it('should walk a tree successfully', async () => {
      for await (const f of files.getFiles(tmpPath)) {
        expect(testFiles).toContain(path.relative(tmpPath, f))
      }
    })
  })
  describe('bytesToSize()', () => {
    it('Returns correct output for various units', () => {
      expect(files.bytesToSize(50)).toEqual('50 Bytes')
      expect(files.bytesToSize(1024)).toEqual('1.0 KB')
      expect(files.bytesToSize(65536)).toEqual('64.0 KB')
      expect(files.bytesToSize(999999999999999)).toEqual('909.5 TB')
    })
  })
})

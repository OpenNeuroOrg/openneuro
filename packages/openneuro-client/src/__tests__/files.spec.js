import { createClient } from '../client'
import * as files from '../files'

jest.mock('../client')
jest.mock('../../../openneuro-server/src/config.js')

const gqlClient = createClient('http://test-uri')

describe('files.js', () => {
  describe('updateFiles mutation', () => {
    it('makes an updateFiles mutation', done => {
      gqlClient
        .mutate({
          mutation: files.updateFiles,
          variables: { datasetId: 'ds000001', files: { name: '' } },
        })
        .then(({ data: { updateFiles } }) => {
          // Returns a Draft with new files
          expect(updateFiles).toHaveProperty('__typename', 'Draft')
        })
        .then(done)
    })
  })
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

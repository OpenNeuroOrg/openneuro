import createClient from '../client'
import * as files from '../files'

jest.mock('../client')

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
})

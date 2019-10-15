import { zipFiles } from '../zip'

// Mocks the browser Response.blob function
function Response(data) {
  return {
    blob: async () => {
      return new Blob([data])
    },
  }
}

describe('service worker - zip support', () => {
  describe('zipFiles', () => {
    it('returns a JSZip blob', async () => {
      const mockStream = { key: 'test-file', stream: new Response('test-data') }
      const zipFile = await zipFiles([mockStream])
      expect(zipFile).toBeInstanceOf(Blob)
      // Catch zero length blobs
      expect(zipFile.size).toBe(141)
    })
  })
})

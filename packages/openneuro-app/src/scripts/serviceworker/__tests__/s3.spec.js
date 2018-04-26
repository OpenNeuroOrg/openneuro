import * as s3 from '../s3'

const ListObjectsDocument = `
<?xml version="1.0" encoding="UTF-8"?>
<ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <Name>quotes</Name>
  <Prefix>E</Prefix>
  <StartAfter>ExampleGuide.pdf</StartAfter>
  <KeyCount>1</KeyCount>
  <MaxKeys>3</MaxKeys>
  <IsTruncated>false</IsTruncated>
  <Contents>
    <Key>ExampleObject.txt</Key>
    <LastModified>2013-09-17T18:07:53.000Z</LastModified>
    <ETag>&quot;599bab3ed2c697f1d26842727561fd94&quot;</ETag>
    <Size>857</Size>
    <StorageClass>REDUCED_REDUNDANCY</StorageClass>
  </Contents>
</ListBucketResult>
`
const contents = [
  {
    key: 'ExampleObject.txt',
    size: '857',
    url: 'http://localhost/ExampleObject.txt',
  },
]

describe('service worker - s3 support', () => {
  beforeEach(() => {
    // Any tests with fetch should call this before running
    fetch.resetMocks()
  })
  describe('listBucket', () => {
    it('returns a promise', () => {
      fetch.mockResponseOnce(ListObjectsDocument)
      expect(s3.listBucket('localhost', 'prefix')).toBeInstanceOf(Promise)
    })
    it('lists all objects in the response', async () => {
      fetch.mockResponseOnce(ListObjectsDocument)
      expect(await s3.listBucket('localhost', 'prefix')).toEqual(contents)
    })
  })
  describe('fetchFiles', () => {
    it('fetches each file', () => {
      fetch.mockResponse('s3 object content')
      const res = s3.fetchFiles(contents)
      expect(res.length).toBe(1)
      res.forEach(obj => {
        expect(typeof obj.key).toBe('string')
        expect(obj.stream).toBeInstanceOf(Promise)
        expect(obj.stream).resolves.toHaveProperty('body')
      })
    })
  })
})

import { fileCacheDeleteFilter } from '../delete-file.jsx'

describe('DeleteFile mutation', () => {
  describe('fileCacheDeleteFilter', () => {
    it('removes a deleted file', () => {
      expect(
        fileCacheDeleteFilter(
          {
            id: 'DatasetFile:abcdef',
            key: 'cdefgh',
            filename: 'sub-01:anat:sub-01_T1w.nii.gz',
            directory: false,
          },
          'sub-01:anat',
          'sub-01_T1w.nii.gz',
          [],
        ),
      ).toBe(false)
    })
    it('does not remove a present file', () => {
      expect(
        fileCacheDeleteFilter(
          {
            id: 'DatasetFile:abcdef',
            key: 'cdefgh',
            filename: 'sub-02:anat:sub-02_T1w.nii.gz',
            directory: false,
          },
          'sub-01:anat',
          'sub-01_T1w.nii.gz',
          [],
        ),
      ).toBe(true)
    })
    it('removes a matching directory', () => {
      expect(
        fileCacheDeleteFilter(
          {
            id: 'DatasetFile:abcdef',
            key: 'cdefgh',
            filename: 'sub-01:anat',
            directory: true,
          },
          'sub-01:anat',
          '',
          [],
        ),
      ).toBe(false)
    })
    it('removes empty directories with a child being deleted', () => {
      const cachedFileObjects = [
        {
          __typename: 'DatasetFile',
          id: '3d9b15b3ef4e9da06e265e6078d3b4ddf8495102',
          key: 'c2ee90bf6c477b9e808e2b649a9492e947493297',
          filename: 'CHANGES',
          directory: false,
        },
        {
          __typename: 'DatasetFile',
          id: '63888a199a5ce37377b1cd708cda59577dad218f',
          key: 'fa84e5f958ec72d42b3e196e592f6db9f7104b19',
          filename: 'README',
          directory: false,
        },
        {
          __typename: 'DatasetFile',
          id: 'aef1717a00106adc115f64990944d86e154d3e03',
          key: 'e652e8add021fe2684ce2404b431dee4315c9c95',
          filename: 'dataset_description.json',
          directory: false,
        },
        {
          __typename: 'DatasetFile',
          id: '0a2a5d8d72a31f03608db59c4cfd650aba77c363',
          key: 'b08aa0ec5b5e716479824859524a22140fb2af82',
          filename: 'T1w.json',
          directory: false,
        },
        {
          __typename: 'DatasetFile',
          id: 'f682a32c9538082fa6c8ad11e9a536dc07d1d0cf',
          key: '37ecbdc7ab8ffaf2cddecc338092f6679089287d',
          filename: 'participants.tsv',
          directory: false,
        },
        {
          __typename: 'DatasetFile',
          id: 'c2ffc386e99bb26fbfc0d6bb33713b91b95a51f2',
          key: null,
          filename: 'sub-01',
          directory: true,
        },
        {
          __typename: 'DatasetFile',
          id: '141c63f3373f17477c83f42c9fab01e6825052a0',
          key: null,
          filename: 'sub-02',
          directory: true,
        },
        {
          __typename: 'DatasetFile',
          id: '635818b25263badb6d105aab8e33822f54ebbecf',
          key: null,
          filename: 'sub-02:anat',
          directory: true,
        },
        {
          __typename: 'DatasetFile',
          id: 'b6f937773aa2130aa9d06fc3024cd1b150baa70b',
          key: 'SHA256E-s311112--c3527d7944a9619afb57863a34e6af7ec3fe4f108e56c860d9e700699ff806fb.nii.gz',
          filename: 'sub-02:anat:sub-02_T1w.nii.gz',
          directory: false,
        },
      ]
      expect(
        fileCacheDeleteFilter(
          {
            id: '141c63f3373f17477c83f42c9fab01e6825052a0',
            key: null,
            filename: 'sub-02',
            directory: true,
          },
          'sub-02:anat',
          'sub-02_T1w.nii.gz',
          cachedFileObjects,
        ),
      ).toBe(false)
      expect(
        fileCacheDeleteFilter(
          {
            id: '635818b25263badb6d105aab8e33822f54ebbecf',
            key: null,
            filename: 'sub-02:anat',
            directory: true,
          },
          'sub-02:anat',
          'sub-02_T1w.nii.gz',
          cachedFileObjects,
        ),
      ).toBe(false)
      expect(
        fileCacheDeleteFilter(
          {
            id: 'b6f937773aa2130aa9d06fc3024cd1b150baa70b',
            key: 'SHA256E-s311112--c3527d7944a9619afb57863a34e6af7ec3fe4f108e56c860d9e700699ff806fb.nii.gz',
            filename: 'sub-02:anat:sub-02_T1w.nii.gz',
            directory: false,
          },
          'sub-02:anat',
          'sub-02_T1w.nii.gz',
          cachedFileObjects,
        ),
      ).toBe(false)
    })
    it('does not remove non-empty directories with a child being deleted', () => {
      expect(
        fileCacheDeleteFilter(
          {
            id: 'DatasetFile:abcdef',
            key: 'cdefgh',
            filename: 'sub-02:anat',
            directory: true,
          },
          '',
          'sub-02:anat:sub-02_T1w.json',
          [
            {
              id: 'DatasetFile:123456',
              key: 'cdefgh',
              filename: 'sub-02:anat:sub-02_T1w.nii.gz',
              directory: false,
            },
          ],
        ),
      ).toBe(true)
    })
    it('does not remove directories that are empty but not having a child deleted', () => {
      // This is also false because the directory has no files in cachedFileObjects
      expect(
        fileCacheDeleteFilter(
          {
            id: 'DatasetFile:abcdef',
            key: 'cdefgh',
            filename: 'sub-02:anat',
            directory: true,
          },
          'sub-01:anat',
          '',
          [],
        ),
      ).toBe(true)
    })
  })
})

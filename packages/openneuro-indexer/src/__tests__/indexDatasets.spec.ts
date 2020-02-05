import { extractDatasetDocument } from '../indexDatasets'

describe('indexDatasets', () => {
  describe('extractDatasetDocument', () => {
    it('filters __typename fields', () => {
      expect(
        extractDatasetDocument({
          id: 'ds000005',
          metadata: {
            species: 'Human',
          },
          latestSnapshot: {
            id: 'ds000005:1.0.0',
            tag: '1.0.0',
            name: 'a test dataset',
            readme: 'a longer description of this dataset',
            description: {
              Name: 'a test dataset',
              Authors: ['J. Doe', 'A. Nonymous'],
            },
            __typename: 'Snapshot',
          },
          __typename: 'Dataset',
        }),
      ).toEqual({
        body: {
          datasetId: "ds000005",
          authors: ['J. Doe', 'A. Nonymous'],
          metadata: {
            species: 'Human',
          },
          name: 'a test dataset',
          readme: 'a longer description of this dataset',
          tag: '1.0.0',
        },
        index: 'datasets',
      })
    })
  })
})

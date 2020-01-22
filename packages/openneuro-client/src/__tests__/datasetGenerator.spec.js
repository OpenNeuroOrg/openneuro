import datasetGenerator from '../datasetGenerator'

const firstResult = Promise.resolve({
  data: {
    datasets: {
      edges: [
        {
          node: { id: 'ds000001', __typename: 'Dataset' },
          __typename: 'DatasetEdge',
        },
        {
          node: { id: 'ds000002', __typename: 'Dataset' },
          __typename: 'DatasetEdge',
        },
      ],
      pageInfo: {
        endCursor: '11111',
        hasNextPage: true,
      },
    },
  },
})

const secondResult = Promise.resolve({
  data: {
    datasets: {
      edges: [
        {
          node: { id: 'ds000003', __typename: 'Dataset' },
          __typename: 'DatasetEdge',
        },
        {
          node: { id: 'ds000004', __typename: 'Dataset' },
          __typename: 'DatasetEdge',
        },
      ],
      pageInfo: {
        endCursor: '22222',
        hasNextPage: false,
      },
    },
  },
})

const noDataResult = Promise.resolve({
  data: {
    datasets: {
      edges: [],
      pageInfo: {
        endCursor: '22222',
        hasNextPage: false,
      },
    },
  },
})

describe('datasetGenerator()', () => {
  it('returns paginated datasets', async done => {
    const mockQuery = {}
    // To keep this test from being tied to apollo-client, mock the query method
    const mockClient = {
      query: jest.fn(queryArgs => {
        const cursor = queryArgs.variables.cursor
        if (cursor === undefined) {
          return firstResult
        } else if (cursor === '11111') {
          return secondResult
        } else if (cursor === '22222') {
          return noDataResult
        } else {
          throw new Error('Unknown mock cursor')
        }
      }),
    }
    const dsGen = datasetGenerator(mockClient, mockQuery)
    // Simulate a for await (...) {} loop
    const { value: firstDataset } = await dsGen.next()
    expect(firstDataset.id).toBe('ds000001')
    const { value: secondDataset } = await dsGen.next()
    expect(secondDataset.id).toBe('ds000002')
    const { value: thirdDataset } = await dsGen.next()
    expect(thirdDataset.id).toBe('ds000003')
    const { value: fourthDataset } = await dsGen.next()
    expect(fourthDataset.id).toBe('ds000004')
    const { value: fifthDataset } = await dsGen.next()
    // Validate that the final result is null
    expect(fifthDataset).toBe(null)
    done()
  })
})

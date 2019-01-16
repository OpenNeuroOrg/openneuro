import { updateQuery } from '../dataset-query.jsx'

describe('dashboard/datasets/DatasetQuery', () => {
  describe('updateQuery()', () => {
    it('includes typename in result', () => {
      // This led to an error on the id property but __typename just needs to be included
      expect(
        updateQuery(
          {
            datasets: {
              __typename: 'testType',
              edges: [{ node: { id: 1 } }, { node: { id: 2 } }],
            },
          },
          {
            fetchMoreResult: {
              datasets: {
                edges: [{ node: { id: 3 } }, { node: { id: 4 } }],
                pageInfo: {},
              },
            },
          },
        ),
      ).toHaveProperty('datasets.__typename')
    })
    it('merges datasets from previousResult with fetchMoreResult', () => {
      expect(
        updateQuery(
          {
            datasets: {
              __typename: 'testType',
              edges: [{ node: { id: 1 } }, { node: { id: 2 } }],
            },
          },
          {
            fetchMoreResult: {
              datasets: {
                edges: [{ node: { id: 3 } }, { node: { id: 4 } }],
                pageInfo: {},
              },
            },
          },
        ).datasets.edges,
      ).toEqual([
        { node: { id: 1 } },
        { node: { id: 2 } },
        { node: { id: 3 } },
        { node: { id: 4 } },
      ])
    })
  })
})

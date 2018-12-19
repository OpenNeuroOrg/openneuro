import { updateQuery } from '../dataset-query.jsx'

describe('dashboard/datasets/DatasetQuery', () => {
  describe('updateQuery()', () => {
    it('includes typename in result', () => {
      // This led to an error on the id property but __typename just needs to be included
      expect(
        updateQuery(
          { datasets: { __typename: 'testType', edges: [1, 2] } },
          { fetchMoreResult: { datasets: { edges: [3, 4], pageInfo: {} } } },
        ),
      ).toHaveProperty('datasets.__typename')
    })
    it('merges datasets from previousResult with fetchMoreResult', () => {
      expect(
        updateQuery(
          { datasets: { __typename: 'testType', edges: [1, 2] } },
          { fetchMoreResult: { datasets: { edges: [3, 4], pageInfo: {} } } },
        ).datasets.edges,
      ).toEqual([1, 2, 3, 4])
    })
  })
})

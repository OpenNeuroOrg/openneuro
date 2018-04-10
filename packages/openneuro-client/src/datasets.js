import gql from 'graphql-tag'

export const getDataset = datasetId => gql`
  query {
    dataset(id: "${datasetId}") {
      id
      label
    }
  }
`

export const getDatasets = () => gql`
  query {
    datasets {
      id
      label
    }
  }
`

export const createDataset = label => gql`
  mutation {
    createDataset(label: ${label}) {
      id
      label
    }
  }
`

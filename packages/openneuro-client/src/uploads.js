import gql from 'graphql-tag'

export const prepareUpload = gql`
  mutation prepareUpload($datasetId: ID!, $files: [UploadFile]!) {
    prepareUpload(datasetId: $datasetId, files: $files) {
      id
      datasetId
      token
      endpoint
    }
  }
`

export const finishUpload = gql`
  mutation finishUpload($uploadId: ID!) {
    finishUpload(uploadId: $uploadId)
  }
`

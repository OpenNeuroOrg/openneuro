import { DatasetIssues } from "@bids/validator/issues"
import { gql, useQuery } from "@apollo/client"
import { VALIDATION_FIELDS } from "../datalad/dataset/dataset-query-fragments"

export const VALIDATION_DATA_QUERY = gql`
query ($datasetId: ID!, $version: String!) {
  snapshot(datasetId: $datasetId, tag: $version) {
    validation {
      id
      datasetId
      warnings
      errors
      issues {
        ${VALIDATION_FIELDS}
      }
      codeMessages {
        code
        message
      }
    }
  }
}
`

export const useValidationResults = (datasetId: string, version: string) => {
  const { loading, error, data } = useQuery(VALIDATION_DATA_QUERY, {
    variables: { datasetId, version },
  })
  const issues = new DatasetIssues()
  // After loading, construct the dataset issues object for our hook
  if (!loading && !error) {
    const validation = data.snapshot.validation
    // Reconstruct DatasetIssues from JSON
    issues.issues = validation.issues
    issues.codeMessages = validation.codeMessages.reduce(
      (acc, curr) => {
        acc.set(curr.code, curr.message)
        return acc
      },
      new Map<string, string>(),
    )
  }
  return { loading, error, issues }
}

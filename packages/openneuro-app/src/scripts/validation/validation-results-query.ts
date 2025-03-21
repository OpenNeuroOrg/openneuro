import { gql, useQuery } from "@apollo/client"
import { DatasetIssues } from "@bids/validator/issues"
import { VALIDATION_FIELDS } from "../datalad/dataset/dataset-query-fragments"
import { useMemo } from "react"

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
  const { loading, error, data, refetch } = useQuery(VALIDATION_DATA_QUERY, {
    variables: { datasetId, version },
  })

  const memoizedIssues = useMemo(() => {
    const issues = new DatasetIssues()
    if (
      !loading && !error && data && data.snapshot && data.snapshot.validation
    ) {
      const validation = data.snapshot.validation
      issues.issues = validation.issues
      issues.codeMessages = validation.codeMessages.reduce(
        (acc, curr) => {
          acc.set(curr.code, curr.message)
          return acc
        },
        new Map<string, string>(),
      )
    }
    return issues
  }, [loading, error, data])

  return { loading, error, issues: memoizedIssues, refetch }
}

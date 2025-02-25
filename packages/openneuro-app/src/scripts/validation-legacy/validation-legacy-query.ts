import { gql, useQuery } from "@apollo/client"
import { ISSUE_FIELDS } from "../datalad/dataset/dataset-query-fragments"

export const LEGACY_VALIDATION_DATA_QUERY = gql`
query ($datasetId: ID!, $version: String!) {
  snapshot(datasetId: $datasetId, tag: $version) {
    issues {
      ${ISSUE_FIELDS}
    }
  }
}
`

export const useLegacyValidationResults = (
  datasetId: string,
  version: string,
) => {
  const { loading, error, data } = useQuery(LEGACY_VALIDATION_DATA_QUERY, {
    variables: { datasetId, version },
  })
  if (!loading && data) {
    return { loading, error, issues: data.snapshot.issues }
  } else {
    return { loading, error, issues: [] }
  }
}

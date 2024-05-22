import { Client as ElasticClient } from "@elastic/elasticsearch"
import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client"
import { DatasetsIndex } from "./indexes/datasets"

export const INDEX_DATASET_FRAGMENT = gql`
  fragment DatasetIndex on Dataset {
    id
    created
    public
    metadata {
      datasetName
      datasetUrl
      dataProcessed
      firstSnapshotCreatedAt
      latestSnapshotCreatedAt
      ages
      modalities
      datasetId
      dxStatus
      trialCount
      tasksCompleted
      studyDesign
      studyDomain
      studyLongitudinal
      dataProcessed
      species
      associatedPaperDOI
      openneuroPaperDOI
      seniorAuthor
      grantFunderName
      grantIdentifier
    }
    latestSnapshot {
      id
      tag
      description {
        Name
        Authors
        SeniorAuthor
        DatasetType
      }
      summary {
        tasks
        modalities
        secondaryModalities
        subjectMetadata {
          participantId
          group
          sex
          age
        }
        subjects
        pet {
          BodyPart
          ScannerManufacturer
          ScannerManufacturersModelName
          TracerName
          TracerRadionuclide
        }
      }
      readme
    }
    draft {
      issues {
        severity
      }
    }
    permissions {
      userPermissions {
        level
        user {
          id
        }
      }
    }
    analytics {
      downloads
    }
  }
`

export const indexDatasetQuery = gql`
  query dataset($datasetId: ID!) {
    dataset(id: $datasetId) {
      ...DatasetIndex
    }
  }
  ${INDEX_DATASET_FRAGMENT}
`

export const indexQuery = gql`
  query getDatasets(
    $cursor: String
    $orderBy: DatasetSort = { created: descending }
    $filterBy: DatasetFilter = {}
  ) {
    datasets(first: 5, after: $cursor, orderBy: $orderBy, filterBy: $filterBy) {
      edges {
        node {
          ...DatasetIndex
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        count
      }
    }
  }
  ${INDEX_DATASET_FRAGMENT}
`

// TODO: This would be better to generate from the GraphQL schema
export interface DatasetQueryResult {
  id: string
  metadata: Record<string, any>
  latestSnapshot: Record<string, any>
  __typename: string
}

/**
 * Convert from GraphQL dataset object to RequestParams.Index documents
 * TODO: Use generated GraphQL typing
 * @param datasetObj GraphQL dataset object from searchDatasets query
 */
export function extractDatasetDocument(
  datasetObj: DatasetQueryResult,
) {
  const dataset = {
    index: DatasetsIndex.name,
    id: datasetObj.id,
    body: {
      ...datasetObj,
    },
  }
  return dataset
}

/**
 * Query a single dataset for indexing
 * @param datasetId Accession number
 */
export function queryForIndex(
  apolloClient: ApolloClient<NormalizedCacheObject>,
  datasetId: string,
) {
  return apolloClient.query({
    query: indexDatasetQuery,
    variables: { datasetId },
    errorPolicy: "all",
  })
}

/**
 * Index one dataset (latest snapshot)
 * @param elasticClient Elastic client to submit index data
 * @param datasetObj OpenNeuro GraphQL dataset object
 */
export async function indexDataset(
  elasticClient: ElasticClient,
  datasetObj: DatasetQueryResult,
) {
  try {
    console.log(`Indexing "${datasetObj.id}"`)
    const response = await elasticClient.index(
      extractDatasetDocument(datasetObj),
    )
    return response
  } catch (err) {
    console.dir(err)
  }
}

import { gql } from "@apollo/client"

export const getDatasets = gql`
  query getDatasets(
    $cursor: String
    $orderBy: DatasetSort = { created: descending }
    $filterBy: DatasetFilter = {}
    $myDatasets: Boolean = false
  ) {
    datasets(
      first: 25
      after: $cursor
      orderBy: $orderBy
      filterBy: $filterBy
      myDatasets: $myDatasets
    ) {
      edges {
        node {
          id
          created
          uploader {
            id
            name
            orcid
          }
          public
          permissions {
            id
            userPermissions {
              userId
              level
              access: level
              user {
                id
                name
                email
                provider
              }
            }
          }
          draft {
            id
            summary {
              modalities
              secondaryModalities
              sessions
              subjects
              subjectMetadata {
                participantId
                age
                sex
                group
              }
              tasks
              size
              totalFiles
              dataProcessed
              pet {
                BodyPart
                ScannerManufacturer
                ScannerManufacturersModelName
                TracerName
                TracerRadionuclide
              }
            }
            issues {
              severity
            }
            description {
              Name
            }
          }
          analytics {
            views
            downloads
          }
          stars {
            userId
            datasetId
          }
          followers {
            userId
            datasetId
          }
          snapshots {
            id
            created
            tag
          }
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
        count
      }
    }
  }
`

/**
 * Iterator over all public datasets associated with a client connection
 * @param {import('@apollo/client').ApolloClient} client
 * @param {*} query
 */
export async function* datasetGenerator(client, query = getDatasets) {
  let cursor
  while (true) {
    try {
      const { data } = await client.query({
        query,
        variables: { cursor },
        errorPolicy: "all",
      })
      for (const edge of data.datasets.edges) {
        if (edge && Object.hasOwn(edge, "node")) {
          // Yield one dataset if it did not error
          yield edge.node
        } else {
          continue
        }
      }
      if (data.datasets.pageInfo.hasNextPage) {
        // Next query with new cursor
        cursor = data.datasets.pageInfo.endCursor
      } else {
        // Exit if done
        return null
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      return null
    }
  }
}

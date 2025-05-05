import React, { useCallback, useEffect, useState } from "react"
import { DatasetCard } from "./dataset-card"
import { UserDatasetFilters } from "./components/user-dataset-filters"
import { gql, useQuery } from "@apollo/client"
import styles from "./scss/datasetcard.module.scss"
import type { Dataset, UserDatasetsViewProps } from "../types/user-types"
import { INDEX_DATASET_FRAGMENT } from "./fragments/query"
import { filterAndSortDatasets } from "../utils/user-datasets"

export const ADVANCED_SEARCH_DATASETS_QUERY = gql`
  query advancedSearchDatasets(
    $query: JSON!
    $cursor: String
    $allDatasets: Boolean
    $datasetType: String
    $datasetStatus: String
    $sortBy: JSON
  ) {
    datasets: advancedSearch(
      query: $query
      allDatasets: $allDatasets
      datasetType: $datasetType
      datasetStatus: $datasetStatus
      sortBy: $sortBy
      first: 25
      after: $cursor
    ) {
      edges {
        id
        node {
          id
          created
          name
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
          metadata {
            ages
          }
          latestSnapshot {
            size
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
            validation {
              errors
              warnings
            }
            description {
              Name
              Authors
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

export const UserDatasetsView: React.FC<UserDatasetsViewProps> = ({
  user,
  hasEdit,
}) => {
  console.log("User ID Prop:", user?.id)
  const [searchQuery, setSearchQuery] = useState("")
  const [publicFilter, setPublicFilter] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<string>("date-updated")
  const [visibleDatasets, setVisibleDatasets] = useState<Dataset[]>([])
  const [loadMoreLoading, setLoadMoreLoading] = useState(false)
  const [allFetchedDatasets, setAllFetchedDatasets] = useState<Dataset[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [sortBy, setSortBy] = useState<any>(null)

  const initialLoadCount = 25

  const generateElasticsearchQuery = useCallback(
    (currentSearchQuery: string, currentPublicFilter: string) => {
      const baseQuery: any = {
        bool: {
          filter: [],
          must: [],
        },
      }

      if (user?.id) {
        baseQuery.bool.filter.push({
          terms: {
            "permissions.userPermissions.user.id": [user.id],
          },
        })
      }

      if (currentPublicFilter === "public") {
        baseQuery.bool.filter.push({ term: { public: true } })
      } else if (currentPublicFilter === "private") {
        baseQuery.bool.filter.push({ term: { public: false } })
      }

      if (currentSearchQuery) {
        baseQuery.bool.must.push({
          bool: {
            should: [
              {
                multi_match: {
                  query: currentSearchQuery,
                  fields: [
                    "id^3",
                    "name^3",
                    "description.Name^3",
                    "description.Authors^3",
                    "latestSnapshot.description.Name",
                    "latestSnapshot.description.Authors",
                    "latestSnapshot.readme",
                  ],
                  fuzziness: 1,
                },
              },
              {
                prefix: {
                  name: currentSearchQuery.toLowerCase(),
                },
              },
              {
                prefix: {
                  "description.Name": currentSearchQuery.toLowerCase(),
                },
              },
            ],
            minimum_should_match: 1,
          },
        })
      } else {
        baseQuery.bool.must.push({ match_all: {} })
      }

      return baseQuery
    },
    [user?.id],
  )

  const [elasticsearchQuery, setElasticsearchQuery] = useState(() =>
    generateElasticsearchQuery("", "all")
  )

  const { data, loading, error, fetchMore, refetch } = useQuery(
    ADVANCED_SEARCH_DATASETS_QUERY,
    {
      variables: {
        first: initialLoadCount,
        query: elasticsearchQuery,
        sortBy: sortBy,
        cursor: null,
        allDatasets: true,
        datasetType: undefined,
        datasetStatus: undefined,
      },
      onCompleted: (initialData) => {
        const initialEdges = initialData?.datasets?.edges || []
        const initialDatasets = initialEdges.map((edge) => edge.node)
        setAllFetchedDatasets(initialDatasets)
        setVisibleDatasets(initialDatasets)
        setCursor(initialData?.datasets?.pageInfo?.endCursor || null)
        setHasNextPage(initialData?.datasets?.pageInfo?.hasNextPage || false)
        console.log("Initial Data (onCompleted):", initialData)
        if (initialDatasets.length > 0) {
          console.log("First Initial Dataset:", initialDatasets[0])
        }
      },
      errorPolicy: "ignore",
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    },
  )

  useEffect(() => {
    if (data?.datasets?.edges) {
      const fetched = data.datasets.edges.map((edge) => edge.node)
      setAllFetchedDatasets(fetched)
      setVisibleDatasets(fetched)
    }
  }, [data])

  console.log(
    "Elasticsearch Query:",
    JSON.stringify(elasticsearchQuery, null, 2),
  )
  console.log("Render:", {
    hasNextPage: hasNextPage,
    allFetchedLength: allFetchedDatasets.length,
    visibleLength: visibleDatasets.length,
    loading: loading,
    cursor: cursor,
  })

  const handleSearch = useCallback(
    (newSearchQuery: string, currentPublicFilter: string) => {
      setSearchQuery(newSearchQuery)
      setPublicFilter(currentPublicFilter)
      const newElasticsearchQuery = generateElasticsearchQuery(
        newSearchQuery,
        currentPublicFilter,
      )

      console.log(
        "Search Query being sent:",
        JSON.stringify(newElasticsearchQuery, null, 2),
      )

      setElasticsearchQuery(newElasticsearchQuery)
      refetch({ query: newElasticsearchQuery, cursor: null, sortBy: sortBy })
    },
    [
      generateElasticsearchQuery,
      refetch,
      setSearchQuery,
      setPublicFilter,
      setElasticsearchQuery,
      sortBy,
    ],
  )

  const handlePublicFilterChange = useCallback((newPublicFilter) => {
    setPublicFilter(newPublicFilter)
    const newElasticsearchQuery = generateElasticsearchQuery(
      searchQuery,
      newPublicFilter,
    )
    setElasticsearchQuery(newElasticsearchQuery)
    refetch({ query: newElasticsearchQuery, cursor: null, sortBy: sortBy })
  }, [
    setPublicFilter,
    generateElasticsearchQuery,
    refetch,
    searchQuery,
    sortBy,
  ])

  const handleSortOrderChange = useCallback((newSortOrder) => {
    setSortOrder(newSortOrder)
    let newSortBy = null
    switch (newSortOrder) {
      case "name-asc":
        newSortBy = { "metadata.datasetName": "asc" }
        break
      case "name-desc":
        newSortBy = { "metadata.datasetName": "desc" }
        break
      case "date-newest":
        newSortBy = { created: "desc" }
        break
      case "date-oldest":
        newSortBy = { created: "asc" }
        break
      case "date-updated":
        newSortBy = { "metadata.latestSnapshotCreatedAt": "desc" }
        break
      default:
        newSortBy = null
    }
    setSortBy(newSortBy)
    refetch({
      sortBy: newSortBy,
      first: 25,
      cursor: null,
      query: elasticsearchQuery,
    })
  }, [setSortOrder, refetch, setSortBy, elasticsearchQuery])

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || loadMoreLoading || !cursor) {
      return
    }

    setLoadMoreLoading(true)
    fetchMore({
      variables: {
        first: 100,
        cursor: cursor,
        query: elasticsearchQuery,
        sortBy: sortBy,
        allDatasets: true,
        datasetType: undefined,
        datasetStatus: undefined,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult?.datasets?.edges) {
          return previousResult
        }

        const newEdges = fetchMoreResult.datasets.edges
        const newNodes = newEdges.map((edge) => edge.node)
        const newCursor = fetchMoreResult.datasets.pageInfo.endCursor
        const newHasNextPage = fetchMoreResult.datasets.pageInfo.hasNextPage

        setAllFetchedDatasets((prev) => [...prev, ...newNodes])
        setCursor(newCursor)
        setHasNextPage(newHasNextPage)
        console.log("Fetch More Result:", fetchMoreResult)
        if (newNodes.length > 0) {
          console.log("First New Dataset (Load More):", newNodes[0])
        }

        return {
          datasets: {
            __typename: previousResult.datasets.__typename,
            edges: [...previousResult.datasets.edges, ...newEdges],
            pageInfo: {
              ...previousResult.datasets.pageInfo,
              endCursor: newCursor,
              hasNextPage: newHasNextPage,
            },
          },
        }
      },
    }).finally(() => {
      setLoadMoreLoading(false)
    })
  }, [
    fetchMore,
    hasNextPage,
    loadMoreLoading,
    cursor,
    elasticsearchQuery,
    sortBy,
  ])

  useEffect(() => {
    const newElasticsearchQuery = generateElasticsearchQuery(
      searchQuery,
      publicFilter,
    )
    setElasticsearchQuery(newElasticsearchQuery)
  }, [searchQuery, publicFilter, generateElasticsearchQuery])

  useEffect(() => {
    if (elasticsearchQuery) {
      refetch({ query: elasticsearchQuery, cursor: null, sortBy: sortBy }) // Initial refetch with sort
    }
  }, [elasticsearchQuery, refetch, sortBy])

  if (loading) return <p>Loading datasets...</p>
  if (error) return <p>Failed to fetch datasets: {error.message}</p>

  const visibleToRender = visibleDatasets

  return (
    <div data-testid="user-datasets-view">
      <h3>{user.name}'s Datasets</h3>

      <UserDatasetFilters
        publicFilter={publicFilter}
        setPublicFilter={handlePublicFilterChange}
        sortOrder={sortOrder}
        setSortOrder={handleSortOrderChange}
        onSearch={handleSearch}
        currentSearchTerm={searchQuery}
      />

      <div className={styles.userDsWrap}>
        {visibleToRender.length > 0
          ? (
            visibleToRender.map((dataset) => (
              <DatasetCard
                key={dataset.id}
                dataset={dataset}
                hasEdit={hasEdit}
              />
            ))
          )
          : <p>No datasets found.</p>}
      </div>

      {hasNextPage && (
        <button onClick={handleLoadMore} disabled={loadMoreLoading}>
          {loadMoreLoading ? "Loading more..." : "Load More"}
        </button>
      )}
    </div>
  )
}

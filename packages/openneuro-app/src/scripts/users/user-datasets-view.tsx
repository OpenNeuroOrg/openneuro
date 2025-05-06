import React, { useCallback, useEffect, useState } from "react"
import { useQuery } from "@apollo/client"
import * as Sentry from "@sentry/react"
import { DatasetCard } from "./dataset-card"
import { UserDatasetFilters } from "./components/user-dataset-filters"
import { ADVANCED_SEARCH_DATASETS_QUERY } from "../queries/user"
import { Button } from "../components/button/Button"
import { Loading } from "../components/loading/Loading"
import type { Dataset, UserDatasetsViewProps } from "../types/user-types"
import styles from "./scss/datasetcard.module.scss"

type SortByType = {
  [key: string]: "asc" | "desc"
} | null

interface ElasticsearchQuery {
  bool: {
    filter: (
      | { terms: { "permissions.userPermissions.user.id": string[] } }
      | { term: { public: boolean | null } }
    )[]
    must: (
      | {
        bool: {
          should: (
            | {
              multi_match: {
                query: string
                fields: string[]
                fuzziness: number
              }
            }
            | { prefix: { name: string } }
            | { prefix: { "description.Name": string } }
          )[]
          minimum_should_match: number
        }
      }
      | { match_all: Record<string, never> }
    )[]
  }
}

export const UserDatasetsView: React.FC<UserDatasetsViewProps> = ({
  orcidUser,
  hasEdit,
}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [publicFilter, setPublicFilter] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<string>("date-updated")
  const [visibleDatasets, setVisibleDatasets] = useState<Dataset[]>([])
  const [loadMoreLoading, setLoadMoreLoading] = useState(false)
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [sortBy, setSortBy] = useState<SortByType>(null)
  const loadAmount = 26

  const generateElasticsearchQuery = useCallback(
    (
      currentSearchQuery: string,
      currentPublicFilter: string,
    ): ElasticsearchQuery => {
      const baseQuery: ElasticsearchQuery = {
        bool: {
          filter: [],
          must: [],
        },
      }

      if (orcidUser?.id) {
        baseQuery.bool.filter.push({
          terms: {
            "permissions.userPermissions.user.id": [orcidUser.id],
          },
        })
      }

      if (hasEdit) {
        if (currentPublicFilter === "public") {
          baseQuery.bool.filter.push({ term: { public: true } })
        }
      } else {
        baseQuery.bool.filter.push({ term: { public: true } })
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
    [orcidUser?.id, hasEdit],
  )

  const [elasticsearchQuery, setElasticsearchQuery] = useState(() =>
    generateElasticsearchQuery("", "all")
  )

  const { data, loading, error, fetchMore, refetch } = useQuery(
    ADVANCED_SEARCH_DATASETS_QUERY,
    {
      variables: {
        first: loadAmount,
        query: elasticsearchQuery,
        sortBy: sortBy,
        cursor: null,
        allDatasets: true,
        datasetStatus: undefined,
      },
      onCompleted: (initialData) => {
        const initialEdges = initialData?.datasets?.edges || []
        const initialDatasets = initialEdges.map((edge) => edge.node)
        setVisibleDatasets(initialDatasets)
        setCursor(initialData?.datasets?.pageInfo?.endCursor || null)
        setHasNextPage(initialData?.datasets?.pageInfo?.hasNextPage || false)
      },
      onError: (err) => {
        Sentry.captureException(err)
      },
      errorPolicy: "ignore",
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    },
  )

  const handleSearch = useCallback(
    (newSearchQuery: string, currentPublicFilter: string) => {
      setSearchQuery(newSearchQuery)
      setPublicFilter(currentPublicFilter)
      const newElasticsearchQuery = generateElasticsearchQuery(
        newSearchQuery,
        currentPublicFilter,
      )
      setElasticsearchQuery(newElasticsearchQuery)
      refetch({
        query: newElasticsearchQuery,
        cursor: null,
        sortBy: sortBy,
        datasetStatus: undefined,
      })
    },
    [
      generateElasticsearchQuery,
      refetch,
      setSearchQuery,
      setPublicFilter,
      setElasticsearchQuery,
      sortBy,
      hasEdit,
      orcidUser?.id,
    ],
  )

  const handlePublicFilterChange = useCallback(
    (newPublicFilter) => {
      setPublicFilter(newPublicFilter)
      const newElasticsearchQuery = generateElasticsearchQuery(
        searchQuery,
        newPublicFilter,
      )
      setElasticsearchQuery(newElasticsearchQuery)
      refetch({
        query: newElasticsearchQuery,
        cursor: null,
        sortBy: sortBy,
        datasetStatus: undefined,
      })
    },
    [
      setPublicFilter,
      generateElasticsearchQuery,
      refetch,
      searchQuery,
      sortBy,
      hasEdit,
      orcidUser?.id,
    ],
  )

  const handleSortOrderChange = useCallback(
    (newSortOrder) => {
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
        first: loadAmount,
        cursor: null,
        query: elasticsearchQuery,
        datasetStatus: undefined,
      })
    },
    [setSortOrder, refetch, setSortBy, elasticsearchQuery, hasEdit],
  )

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || loadMoreLoading || !cursor) {
      return
    }

    setLoadMoreLoading(true)
    fetchMore({
      variables: {
        first: loadAmount,
        cursor: cursor,
        query: elasticsearchQuery,
        sortBy: sortBy,
        allDatasets: true,
        datasetStatus: undefined,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult?.datasets?.edges) {
          return previousResult
        }

        const newEdges = fetchMoreResult.datasets.edges
        const newCursor = fetchMoreResult.datasets.pageInfo.endCursor
        const newHasNextPage = fetchMoreResult.datasets.pageInfo.hasNextPage

        setCursor(newCursor)
        setHasNextPage(newHasNextPage)

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
    hasEdit,
  ])

  useEffect(() => {
    if (data?.datasets?.edges) {
      const fetched = data.datasets.edges.map((edge) => edge.node)
      setVisibleDatasets(fetched)
      setHasNextPage(data?.datasets?.pageInfo?.hasNextPage || false)
    }
  }, [data, hasEdit, loadAmount])

  useEffect(() => {
    const newElasticsearchQuery = generateElasticsearchQuery(
      searchQuery,
      publicFilter,
    )
    setElasticsearchQuery(newElasticsearchQuery)
  }, [searchQuery, publicFilter, generateElasticsearchQuery])

  useEffect(() => {
    if (elasticsearchQuery) {
      refetch({
        query: elasticsearchQuery,
        cursor: null,
        sortBy: sortBy,
        datasetStatus: undefined,
      })
    }
  }, [elasticsearchQuery, refetch, sortBy, hasEdit])

  if (loading) return <Loading />
  if (error) {
    return (
      <p>
        Failed to load datasets. Please contact an administrator if the error
        persists.
      </p>
    )
  }

  const visibleToRender = visibleDatasets
  return (
    <div
      className={styles.userDatasetsWrapper}
      data-testid="user-datasets-view"
    >
      <h3>{orcidUser.name}'s Datasets</h3>

      <UserDatasetFilters
        publicFilter={publicFilter}
        setPublicFilter={handlePublicFilterChange}
        sortOrder={sortOrder}
        setSortOrder={handleSortOrderChange}
        onSearch={handleSearch}
        currentSearchTerm={searchQuery}
        hasEdit={hasEdit}
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

      {visibleToRender.length >= loadAmount && !loadMoreLoading &&
        hasNextPage && (
        <div className="load-more">
          <Button label="Load More" onClick={handleLoadMore} />
        </div>
      )}
    </div>
  )
}

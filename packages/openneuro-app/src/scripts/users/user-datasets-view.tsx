import React, { useCallback, useEffect, useState } from "react"
import { useQuery } from "@apollo/client"
import * as Sentry from "@sentry/react"
import { DatasetCard } from "./dataset-card"
import { UserDatasetFilters } from "./components/user-dataset-filters"
import { ADVANCED_SEARCH_DATASETS_QUERY } from "../queries/user"
import { Button } from "../components/button/Button"
import { Loading } from "../components/loading/Loading"
import {
  type DatasetSearchInput,
  SearchSortOption,
  type UserAdvancedSearchDatasetsQuery,
  type UserQuery,
} from "../../gql/graphql"
import styles from "./scss/datasetcard.module.scss"

type User = NonNullable<UserQuery["user"]>

type Dataset = NonNullable<
  NonNullable<UserAdvancedSearchDatasetsQuery["datasets"]>["edges"]
>[number]["node"]

interface UserDatasetsViewProps {
  orcidUser: User
  hasEdit: boolean
}

const buildSearchInput = (
  searchQuery: string,
  publicFilter: string,
  userId: string | undefined,
  hasEdit: boolean,
  sortBy: SearchSortOption | undefined,
): DatasetSearchInput => {
  const input: DatasetSearchInput = {}

  if (userId) {
    input.userId = userId
  }

  if (hasEdit) {
    if (publicFilter === "public") {
      input.publicOnly = true
    }
  } else {
    input.publicOnly = true
  }

  if (searchQuery) {
    input.keywords = [searchQuery]
  }

  if (sortBy) {
    input.sortBy = sortBy
  }

  return input
}

const SORT_MAP: Record<string, SearchSortOption | undefined> = {
  "name-asc": SearchSortOption.NameAsc,
  "name-desc": SearchSortOption.NameDesc,
  "date-newest": SearchSortOption.Newest,
  "date-oldest": SearchSortOption.Oldest,
  "date-updated": SearchSortOption.LastUpdated,
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
  const loadAmount = 26

  const sortByValue = SORT_MAP[sortOrder]

  const [searchInput, setSearchInput] = useState<DatasetSearchInput>(() =>
    buildSearchInput("", "all", orcidUser?.id, hasEdit, sortByValue)
  )

  const { data, loading, error, fetchMore, refetch } = useQuery(
    ADVANCED_SEARCH_DATASETS_QUERY,
    {
      variables: {
        first: loadAmount,
        query: searchInput,
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
      const newInput = buildSearchInput(
        newSearchQuery,
        currentPublicFilter,
        orcidUser?.id,
        hasEdit,
        sortByValue,
      )
      setSearchInput(newInput)
      refetch({
        query: newInput,
        cursor: null,
        datasetStatus: undefined,
      })
    },
    [refetch, sortByValue, hasEdit, orcidUser?.id],
  )

  const handlePublicFilterChange = useCallback(
    (newPublicFilter) => {
      setPublicFilter(newPublicFilter)
      const newInput = buildSearchInput(
        searchQuery,
        newPublicFilter,
        orcidUser?.id,
        hasEdit,
        sortByValue,
      )
      setSearchInput(newInput)
      refetch({
        query: newInput,
        cursor: null,
        datasetStatus: undefined,
      })
    },
    [refetch, searchQuery, sortByValue, hasEdit, orcidUser?.id],
  )

  const handleSortOrderChange = useCallback(
    (newSortOrder) => {
      setSortOrder(newSortOrder)
      const newSortByValue = SORT_MAP[newSortOrder]
      const newInput = buildSearchInput(
        searchQuery,
        publicFilter,
        orcidUser?.id,
        hasEdit,
        newSortByValue,
      )
      setSearchInput(newInput)
      refetch({
        query: newInput,
        first: loadAmount,
        cursor: null,
        datasetStatus: undefined,
      })
    },
    [refetch, searchQuery, publicFilter, hasEdit, orcidUser?.id],
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
        query: searchInput,
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
    searchInput,
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
    const newInput = buildSearchInput(
      searchQuery,
      publicFilter,
      orcidUser?.id,
      hasEdit,
      sortByValue,
    )
    setSearchInput(newInput)
  }, [searchQuery, publicFilter, orcidUser?.id, hasEdit, sortByValue])

  useEffect(() => {
    if (searchInput) {
      refetch({
        query: searchInput,
        cursor: null,
        datasetStatus: undefined,
      })
    }
  }, [searchInput, refetch, hasEdit])

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

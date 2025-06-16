import React, { useContext, useEffect, useState } from "react"
import type { FC } from "react"
import { useLocation } from "react-router-dom"
import { SearchPage } from "../components/search-page/SearchPage"
import { SearchResultsList } from "../components/search-page/SearchResultsList"
import { NeurobagelSearch } from "../components/search-page/NeurobagelSearch"
import { Button } from "../components/button/Button"
import { Loading } from "../components/loading/Loading"
import {
  AgeRangeInput,
  AllDatasetsToggle,
  AuthorInput,
  BodyPartsInput,
  DatasetTypeSelect,
  DateRadios,
  DiagnosisSelect,
  InitiativeSelect,
  KeywordInput,
  ModalitySelect,
  ScannerManufacturers,
  ScannerManufacturersModelNames,
  SectionSelect,
  SexRadios,
  ShowDatasetRadios,
  SortBySelect,
  SpeciesSelect,
  StudyDomainInput,
  SubjectCountRangeInput,
  TaskInput,
  TracerNames,
  TracerRadionuclides,
} from "./inputs"
import FiltersBlockContainer from "./filters-block-container"
import AggregateCountsContainer from "../pages/front-page/aggregate-queries/aggregate-counts-container"
import { useSearchResults } from "./use-search-results"
import { SearchParamsCtx } from "./search-params-ctx"
import type { SearchParams } from "./initial-search-params"
import Helmet from "react-helmet"
import AdminUser from "../authentication/admin-user.jsx"
import { SearchResultItemProps } from "../components/search-page/SearchResultItem"

export interface SearchContainerProps {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  portalContent?: Record<string, any>
}

/**
 * Setup default search parameters based on URL and other state
 */
export const setDefaultSearch = (
  modality: string,
  grant: string,
  is_grant_portal: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams: Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSearchParams: (newParams: Record<string, any>) => void,
  query: URLSearchParams,
): void => {
  if (query.has("mydatasets")) {
    setSearchParams(
      (prevState: SearchParams): SearchParams => ({
        ...prevState,
        datasetType_selected: "My Datasets",
      }),
    )
  }
  if (query.has("bookmarks")) {
    setSearchParams(
      (prevState: SearchParams): SearchParams => ({
        ...prevState,
        datasetType_selected: "My Bookmarks",
      }),
    )
  }

  const modalitiesWithSecondaries = {
    mri: ["mri", "Diffusion", "Structural", "Functional", "ASL Perfusion"],
    pet: ["pet", "Static", "Dynamic"],
    eeg: ["eeg"],
    ieeg: ["ieeg"],
    meg: ["meg"],
    nirs: ["nirs"],
    nih: ["nih"],
  }

  if (
    modality &&
    !modalitiesWithSecondaries[modality]?.includes(
      searchParams.modality_selected,
    )
  ) {
    setSearchParams((prevState) => ({
      ...prevState,
      modality_selected: modality,
    }))
  }

  // Check for grant-related conditions
  if (
    is_grant_portal && grant === "nih" &&
    searchParams.brain_initiative !== "true"
  ) {
    setSearchParams((prevState) => ({
      ...prevState,
      brain_initiative: "true",
    }))
  }
}

const SearchContainer: FC<SearchContainerProps> = ({ portalContent }) => {
  const location = useLocation()

  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const modality = portalContent?.modality || null
  const selected_grant = portalContent?.portalName || null
  const is_grant_portal = portalContent?.portal || false
  const grant = portalContent?.grant || null

  useEffect(() => {
    setDefaultSearch(
      modality,
      grant,
      is_grant_portal,
      searchParams,
      setSearchParams,
      new URLSearchParams(location.search),
    )
  }, [
    modality,
    grant,
    is_grant_portal,
    searchParams,
    setSearchParams,
    location.search,
  ])

  const { loading, data, fetchMore, variables } = useSearchResults()
  const loadMore = () => {
    fetchMore({
      variables: {
        cursor: data?.datasets?.pageInfo.endCursor,
      },
    })
  }
  let numTotalResults = 0
  let resultsList = []
  let hasNextPage = false

  if (data?.datasets) {
    const edges = data.datasets.edges.filter((edge) => edge)
    numTotalResults = data.datasets.pageInfo.count
    resultsList = edges
    hasNextPage = data.datasets.pageInfo.hasNextPage
  }

  const [clickedItemData, setClickedItemData] = useState<
    SearchResultItemProps["node"] | null
  >(null)
  useEffect(() => {
    setClickedItemData(null)
  }, [JSON.stringify(searchParams)])

  const handleItemClick = (nodeData: SearchResultItemProps["node"]) => {
    setClickedItemData((prevData) =>
      prevData?.id === nodeData.id ? null : nodeData
    )
  }

  const handleCloseDetails = () => {
    setClickedItemData(null)
  }

  // Helper function to format date (assuming it's available or imported)
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  return (
    <>
      <Helmet>
        <title>OpenNeuro - {modality || selected_grant || ""} Search</title>
      </Helmet>
      <SearchPage
        hasDetailsOpen={!!clickedItemData}
        portalContent={portalContent}
        renderAggregateCounts={() =>
          portalContent.modality
            ? <AggregateCountsContainer modality={portalContent.modality} />
            : null}
        renderFilterBlock={() => (
          <FiltersBlockContainer
            loading={loading}
            numTotalResults={numTotalResults}
          />
        )}
        renderSortBy={() => <SortBySelect variables={variables} />}
        renderSearchHeader={() => (
          <>
            {portalContent
              ? (
                <h2>
                  {"Search " + (modality || selected_grant || "") + " Portal"}
                </h2>
              )
              : <h1>{"Search All Datasets"}</h1>}
          </>
        )}
        renderSearchFacets={() => (
          <>
            <NeurobagelSearch />
            <KeywordInput />
            <AdminUser>
              <AllDatasetsToggle />
            </AdminUser>
            {!searchParams.searchAllDatasets && <ShowDatasetRadios />}
            {!portalContent
              ? <ModalitySelect portalStyles={true} label="Modalities" />
              : <ModalitySelect portalStyles={false} label="Choose Modality" />}
            <InitiativeSelect label="Initiatives" />
            <DatasetTypeSelect />
            <AgeRangeInput />
            <SubjectCountRangeInput />
            <DiagnosisSelect />
            <TaskInput />
            <AuthorInput />
            <SexRadios />
            <DateRadios />
            <SpeciesSelect />
            <SectionSelect />
            <StudyDomainInput />
            {(portalContent === undefined ||
              portalContent?.modality === "PET") && (
              <>
                <TracerNames />
              </>
            )}
            {portalContent?.modality === "PET" && (
              <>
                <BodyPartsInput />
                <ScannerManufacturers />
                <ScannerManufacturersModelNames />
                <TracerRadionuclides />
              </>
            )}
          </>
        )}
        renderLoading={() =>
          loading
            ? (
              <div className="search-loading">
                <Loading />
              </div>
            )
            : null}
        renderSearchResultsList={() =>
          !loading && numTotalResults === 0
            ? <h3>No results: please broaden your search.</h3>
            : (
              <>
                <SearchResultsList
                  items={resultsList}
                  datasetTypeSelected={searchParams.datasetType_selected}
                  clickedItemData={clickedItemData}
                  handleItemClick={handleItemClick}
                />
                {/* TODO: make div below into display component. */}
                <div className="grid grid-nogutter" style={{ width: "100%" }}>
                  {hasNextPage && resultsList.length > 0 &&
                    (
                      <div className="col col-12 load-more m-t-10">
                        <Button label="Load More" onClick={loadMore} />
                      </div>
                    )}
                </div>
              </>
            )}
        renderItemDetails={() => (clickedItemData && (
          <div className="search-details">
            <div className="search-details-scroll">
              <button
                className="close-details-button" // Add a class for styling
                onClick={handleCloseDetails}
                aria-label="Close details"
              >
                &times;{" "}
                {/* HTML entity for a multiplication sign, commonly used for 'X' close button */}
              </button>
              <h4>
                More Details for{" "}
                {clickedItemData.latestSnapshot.description?.Name ||
                  clickedItemData.id}
              </h4>
              <p>
                <strong>Total Files:</strong>{" "}
                {clickedItemData.latestSnapshot.summary?.totalFiles
                  .toLocaleString()}
              </p>
              <p>
                <strong>Last Updated:</strong> {formatDate(
                  clickedItemData
                    .snapshots[clickedItemData.snapshots.length - 1]?.created ||
                    clickedItemData.created,
                )}
              </p>
              <p>
                <strong>Uploader:</strong> {clickedItemData.uploader?.name}
              </p>
            </div>
          </div>
        ))}
      />
    </>
  )
}

export default SearchContainer

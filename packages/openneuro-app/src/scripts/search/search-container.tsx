import React, { useContext, useEffect, useRef, useState } from "react"
import type { FC } from "react"
import * as Sentry from "@sentry/react"
import { useLocation } from "react-router-dom"
import { SearchPage } from "./components/SearchPage"
import { SearchResultsList } from "./components/SearchResultsList"
import { NeurobagelSearch } from "./components/NeurobagelSearch"
import { Button } from "../components/button/Button"
import { Loading } from "../components/loading/Loading"
import {
  AgeRangeInput,
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
  SortBySelect,
  SpeciesSelect,
  StudyDomainInput,
  SubjectCountRangeInput,
  TaskInput,
  TracerNames,
  TracerRadionuclides,
} from "./inputs"
import ShowDatasetRadios from "./components/show-datasets-radios"
import FiltersBlockContainer from "./filters-block-container"
import AggregateCountsContainer from "../pages/front-page/aggregate-queries/aggregate-counts-container"
import { useSearchResults } from "./use-search-results"
import { SearchParamsCtx } from "./search-params-ctx"
import type { SearchParams } from "./initial-search-params"
import Helmet from "react-helmet"
import type { SearchResultItemProps } from "./components/SearchResultItem"
import { SearchResultDetails } from "./components/SearchResultDetails"

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
    is_grant_portal &&
    grant === "nih" &&
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

  const lastOpenedButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    setClickedItemData(null)
  }, [JSON.stringify(searchParams)])

  // handleItemClick to accept itemId and event, and store the event.currentTarget
  const handleItemClick = (
    itemId: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const nodeData =
      resultsList.find((item) => item.node.id === itemId)?.node || null

    if (!nodeData) {
      Sentry.captureException(`Error: nodeData not found for ID: ${itemId}`)
      return
    }

    if (clickedItemData && clickedItemData.id === nodeData.id) {
      // If the same item is clicked again, close details
      setClickedItemData(null)
      // Focus will be returned by handleCloseDetails
    } else {
      setClickedItemData(nodeData)
      lastOpenedButtonRef.current = event.currentTarget
    }
  }

  // handleCloseDetails to use setTimeout for focus
  const handleCloseDetails = () => {
    setClickedItemData(null)
    setTimeout(() => {
      if (lastOpenedButtonRef.current) {
        lastOpenedButtonRef.current.focus()
        lastOpenedButtonRef.current = null
      }
    }, 0)
  }

  const labelText = modality
    ? modality.toLowerCase() === "ieeg" ? "iEEG" : modality?.toUpperCase()
    : null

  return (
    <>
      <Helmet>
        <title>OpenNeuro - {labelText || selected_grant || ""} Search</title>
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
          <div className="grid grid-between grid-nogutter">
            <div className="col-lg">
              {portalContent
                ? (
                  <h2>
                    {"Search " + (labelText || selected_grant || "") +
                      " Portal"}
                  </h2>
                )
                : <h1>{"Search All Datasets"}</h1>}
            </div>
            <div className="col-lg text-right">
              <ShowDatasetRadios />
            </div>
          </div>
        )}
        renderSearchFacets={() => (
          <>
            <NeurobagelSearch />
            <KeywordInput />

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
                  {hasNextPage && resultsList.length > 0 && (
                    <div className="col col-12 load-more m-t-10">
                      <Button label="Load More" onClick={loadMore} />
                    </div>
                  )}
                </div>
              </>
            )}
        renderItemDetails={() =>
          clickedItemData && (
            <SearchResultDetails
              itemData={clickedItemData}
              onClose={handleCloseDetails}
            />
          )}
      />
    </>
  )
}

export default SearchContainer

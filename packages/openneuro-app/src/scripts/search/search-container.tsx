import React, { useContext, useEffect } from "react"
import type { FC } from "react"
import { useLocation } from "react-router-dom"
import {
  SearchPage,
  SearchResultsList,
} from "@openneuro/components/search-page"
import {
  getUnexpiredProfile,
  hasEditPermissions,
} from "../authentication/profile"
import { Button } from "@openneuro/components/button"
import { Loading } from "@openneuro/components/loading"
import { NeurobagelSearch } from "@openneuro/components/search-page"
import {
  AgeRangeInput,
  AllDatasetsToggle,
  AuthorInput,
  BodyPartsInput,
  DatasetTypeSelect,
  DateRadios,
  DiagnosisSelect,
  KeywordInput,
  ModalitySelect,
  NIHSelect,
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
import { useCookies } from "react-cookie"
import { useSearchResults } from "./use-search-results"
import { SearchParamsCtx } from "./search-params-ctx"
import type { SearchParams } from "./initial-search-params"
import Helmet from "react-helmet"
import AdminUser from "../authentication/admin-user.jsx"

export interface SearchContainerProps {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  portalContent?: Record<string, any>
}

/**
 * Setup default search parameters based on URL and other state
 */
export const setDefaultSearch = (
  modality: string,
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
    MRI: ["MRI", "Diffusion", "Structural", "Functional", "ASL Perfusion"],
    PET: ["PET", "Static", "Dynamic"],
    EEG: ["EEG"],
    iEEG: ["iEEG"],
    MEG: ["MEG"],
    NIRS: ["NIRS"],
    NIH: ["NIH"],
  }
  if (
    modality &&
    !modalitiesWithSecondaries[modality].includes(
      searchParams.modality_selected,
    )
  ) {
    setSearchParams(
      (prevState: SearchParams): SearchParams => ({
        ...prevState,
        modality_selected: modality,
      }),
    )
  }
}

const SearchContainer: FC<SearchContainerProps> = ({ portalContent }) => {
  const [cookies] = useCookies()
  const profile = getUnexpiredProfile(cookies)
  const location = useLocation()

  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const modality = portalContent?.modality || null
  const selected_grant = portalContent?.portalName || null

  useEffect(() => {
    setDefaultSearch(
      modality,
      searchParams,
      setSearchParams,
      new URLSearchParams(location.search),
    )
  }, [modality, searchParams, setSearchParams, location.search])

  const { loading, data, fetchMore, variables } = useSearchResults()
  const loadMore = loading ? () => {} : () => {
    fetchMore({
      variables: {
        // ...variables,
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

  return (
    <>
      <Helmet>
        <title>OpenNeuro - {modality || selected_grant || ""} Search</title>
      </Helmet>
      <SearchPage
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
              ? "Search " + (modality || selected_grant || "") + " Portal"
              : "Search All Datasets"}
          </>
        )}
        renderSearchFacets={() => (
          <>
            <NIHSelect label={"Search NIH Brain Initiative Datasets"} />
            <NeurobagelSearch />
            <KeywordInput />
            <AdminUser>
              <AllDatasetsToggle />
            </AdminUser>
            {!searchParams.searchAllDatasets && <ShowDatasetRadios />}
            {!portalContent
              ? <ModalitySelect portalStyles={true} label="Modalities" />
              : <ModalitySelect portalStyles={false} label="Choose Modality" />}
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
                  hasEditPermissions={hasEditPermissions}
                  items={resultsList}
                  profile={profile}
                  datasetTypeSelected={searchParams.datasetType_selected}
                />
                {/* TODO: make div below into display component. */}
                <div className="grid grid-nogutter" style={{ width: "100%" }}>
                  {resultsList.length == 0 || !hasNextPage
                    ? null
                    : (
                      <div className="col col-12 load-more m-t-10">
                        <Button label="Load More" onClick={loadMore} />
                      </div>
                    )}
                </div>
              </>
            )}
      />
    </>
  )
}

export default SearchContainer

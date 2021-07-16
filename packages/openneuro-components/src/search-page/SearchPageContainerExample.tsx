import React from 'react'
import useState from 'react-usestateref'
import { FacetBlockContainerExample } from './FacetBlockContainerExample'
import { SearchResultsList } from './SearchResultsList'
import { FiltersBlock } from './FiltersBlock'
import { SearchPage } from './SearchPage'
import { SearchSortContainerExample } from './SearchSortContainerExample'
import { Button } from '../button/Button'
import { sortBy } from '../mock-content/sortby-list'
import { FacetSelect, FacetSelectValueType } from '../facets/FacetSelect'
import { FacetRadio } from '../facets/FacetRadio'
import { FacetRange } from '../facets/FacetRange'
import { FacetSearch } from '../facets/FacetSearch'
import { TermSearch } from '../input/TermSearch'
import { RadioGroup } from '../radio/RadioGroup'
import { Loading } from '../loading/Loading'
import {
  modalities,
  datasetType_available,
  dataset_type,
  diagnosis_list,
  gender_list,
  species_list,
  section_list,
  domain_list,
  date_list,
} from '../mock-content/facet-content'
import { AggregateCount } from '../aggregate-count/AggregateCount'

import './search-page.scss'

export interface SearchContainereProps {
  portalContent?: Record<string, any>
  searchResults
  profile?: Record<string, any>
}

export const SearchPageContainerExample = ({
  searchResults,
  portalContent,
  profile,
}: SearchContainereProps) => {
  const [keywordValue, setKeywordValue, keywordValueRef] = useState('')
  const [allKeywords, setAllKeywords] = React.useState([])
  const pushKeyword = () => {
    setAllKeywords(prevState => [...prevState, keywordValueRef.current])
  }
  const [modality_selected, setModality] =
    React.useState<FacetSelectValueType>()
  const [datasetType_selected, setDatasetsType] = React.useState('All Public')
  const [datasetStatus_selected, setDatasetStatus] =
    React.useState<FacetSelectValueType>()
  const [ageRange, setAgeRange]: [
    [number, number],
    React.Dispatch<[number, number]>,
  ] = React.useState([null, null])
  const [subjectCountRange, setSubjectRange]: [
    [number, number],
    React.Dispatch<[number, number]>,
  ] = React.useState([null, null])
  const [authorValue, setAuthorValue] = React.useState('')
  const [allAuthors, pushAuthor] = React.useState([])
  const [gender_selected, setGender] = React.useState('All')
  const [taskValue, setTaskValue] = React.useState('')
  const [allTasks, pushTask] = React.useState([])
  const [diagnosis_selected, setDiagnosis] =
    React.useState<FacetSelectValueType>()
  const [section_selected, setSection] = React.useState<FacetSelectValueType>()
  const [species_selected, setSpecies] = React.useState<FacetSelectValueType>()
  const [studyDomains, setStudyDomains] = React.useState([])
  const [newDomain, setDomain] = React.useState('')
  const pushNewDomain = (value: string) => {
    setStudyDomains((prevState: string[]) => [...prevState, value])
    setDomain('')
  }

  const [date_selected, setDate] = React.useState('All Time')

  let filterBlockIsEmpty

  if (
    modality_selected === undefined &&
    datasetType_selected === 'All Public' &&
    datasetStatus_selected === undefined &&
    JSON.stringify(ageRange) === JSON.stringify([null, null]) &&
    JSON.stringify(subjectCountRange) === JSON.stringify([null, null]) &&
    gender_selected === 'All' &&
    date_selected === 'All Time' &&
    diagnosis_selected === undefined &&
    section_selected === undefined &&
    species_selected === undefined &&
    studyDomains === undefined &&
    allKeywords.length === 0 &&
    allTasks.length === 0 &&
    allAuthors.length === 0
  ) {
    filterBlockIsEmpty = true
  } else {
    filterBlockIsEmpty = false
  }

  const numTotalResults = 2000

  const loading = false

  return (
    <div>
      <SearchPage
        portalContent={portalContent}
        renderAggregateCounts={() => (
          <>
            <AggregateCount count={100} type="publicDataset" />
            <AggregateCount count={100} type="participants" />
          </>
        )}
        renderFilterBlock={() => (
          <>
            <FiltersBlock
              keywords={allKeywords}
              authors={allAuthors}
              tasks={allTasks}
              modality_selected={modality_selected}
              datasetType_selected={datasetType_selected}
              datasetStatus_selected={datasetStatus_selected}
              ageRange={ageRange}
              subjectCountRange={subjectCountRange}
              gender_selected={gender_selected}
              diagnosis_selected={diagnosis_selected}
              section_selected={section_selected}
              species_selected={species_selected}
              studyDomains={studyDomains}
              date_selected={date_selected}
              numTotalResults={numTotalResults}
              noFilters={filterBlockIsEmpty}
            />
          </>
        )}
        renderSortBy={() => (
          <>
            <div className="col search-sort">
              <SearchSortContainerExample items={sortBy} />
            </div>
          </>
        )}
        renderSearchHeader={() => (
          <>
            {portalContent
              ? 'Search' + ' todo add modality ' + 'Portal'
              : 'Search All Datasets'}
          </>
        )}
        renderSearchFacets={() => (
          <>
            <TermSearch
              className="search-keyword"
              type="text"
              label="Keywords"
              placeholder="eg. something here"
              labelStyle="default"
              name="default-example"
              termValue={keywordValue}
              setTermValue={setKeywordValue}
              primary={true}
              color="#fff"
              icon="fas fa-plus"
              iconSize="20px"
              size="small"
              pushTerm={pushKeyword}
              allTerms={allKeywords}
            />
            <>
              <div
                className={
                  datasetType_selected.replace(/\s/g, '') +
                  ' btn-group-wrapper facet-radio'
                }>
                <RadioGroup
                  setSelected={setDatasetsType}
                  selected={datasetType_selected}
                  name="show-datasets"
                  radioArr={datasetType_available}
                  layout="btn-group"
                />
              </div>
              <FacetSelect
                selected={datasetStatus_selected}
                setSelected={setDatasetStatus}
                items={dataset_type}
                accordionStyle="plain"
                label="My Datasets Status"
                startOpen={true}
                className={
                  datasetType_selected == 'My Datasets'
                    ? 'fade-in-facet'
                    : 'fade-out-facet'
                }
              />
            </>
            <FacetBlockContainerExample>
              {!portalContent ? (
                <FacetSelect
                  selected={modality_selected}
                  setSelected={setModality}
                  items={modalities}
                  accordionStyle="plain"
                  label="Modalities"
                  startOpen={true}
                  className="modality-facet"
                  noAccordion={true}
                />
              ) : (
                <FacetSelect
                  selected={modality_selected}
                  setSelected={setModality}
                  items={modalities}
                  accordionStyle="plain"
                  label="Modalities"
                  startOpen={false}
                  className="modality-facet-accordion"
                  noAccordion={true}
                />
              )}

              <FacetRange
                startOpen={false}
                label="Age of Participants"
                accordionStyle="plain"
                min={0}
                max={100}
                step={10}
                value={[0, 20]}
                onChange={setAgeRange}
              />
              <FacetRange
                startOpen={false}
                label="Number of Participants"
                accordionStyle="plain"
                min={0}
                max={100}
                step={10}
                value={[0, 20]}
                onChange={setSubjectRange}
              />
              <FacetSelect
                selected={diagnosis_selected}
                setSelected={setDiagnosis}
                items={diagnosis_list}
                accordionStyle="plain"
                label="Diagnosis"
                startOpen={false}
              />

              <FacetSearch
                accordionStyle="plain"
                label="Task"
                startOpen={false}
                className="search-authors"
                type="text"
                placeholder="eg. something here"
                labelStyle="default"
                name="default-example"
                termValue={taskValue}
                setTermValue={setTaskValue}
                primary={true}
                color="#fff"
                icon="fas fa-plus"
                iconSize="20px"
                size="small"
                pushTerm={pushTask}
                allTerms={allTasks}
              />

              <FacetSearch
                accordionStyle="plain"
                label="Sr. Author / PI"
                startOpen={false}
                className="search-authors"
                type="text"
                placeholder="eg. something here"
                labelStyle="default"
                name="default-example"
                termValue={authorValue}
                setTermValue={setAuthorValue}
                primary={true}
                color="#fff"
                icon="fas fa-plus"
                iconSize="20px"
                size="small"
                pushTerm={pushAuthor}
                allTerms={allAuthors}
              />
              <FacetRadio
                selected={gender_selected}
                setSelected={setGender}
                radioArr={gender_list}
                layout="row"
                name="Gender"
                startOpen={false}
                label="Gender"
                accordionStyle="plain"
              />
              <FacetRadio
                selected={date_selected}
                setSelected={setDate}
                radioArr={date_list}
                layout="row"
                name="published"
                startOpen={false}
                label="Publication Date"
                accordionStyle="plain"
                className="date-facet"
              />
              <FacetSelect
                selected={species_selected}
                setSelected={setSpecies}
                items={species_list}
                accordionStyle="plain"
                label="Species"
                startOpen={false}
              />
              <FacetSelect
                selected={section_selected}
                setSelected={setSection}
                items={section_list}
                accordionStyle="plain"
                label="Section"
                startOpen={false}
              />
              <FacetSearch
                accordionStyle="plain"
                label="Ontology/Domain Studied"
                startOpen={false}
                className="search-authors"
                type="text"
                placeholder="eg. something here"
                labelStyle="default"
                name="default-example"
                termValue={newDomain}
                setTermValue={setDomain}
                primary={true}
                color="#fff"
                icon="fas fa-plus"
                iconSize="20px"
                size="small"
                pushTerm={setStudyDomains}
                allTerms={studyDomains}
              />
            </FacetBlockContainerExample>
          </>
        )}
        renderLoading={() =>
          loading ? (
            <div className="search-loading">
              <Loading />
            </div>
          ) : null
        }
        renderSearchResultsList={() => (
          <>
            <SearchResultsList items={searchResults} profile={profile} />
            <div className="grid grid-nogutter" style={{ width: '100%' }}>
              <div className="col col-12 load-more ">
                <Button label="Load More" />
              </div>
            </div>
          </>
        )}
      />
    </div>
  )
}

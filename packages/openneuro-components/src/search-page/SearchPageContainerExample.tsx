import React from 'react'
import { FacetBlockContainerExample } from './FacetBlockContainerExample'
import { SearchResultsList } from './SearchResultsList'
import { FiltersBlock } from './FiltersBlock'
import { SearchPage } from './SearchPage'
import { SearchSortContainerExample } from './SearchSortContainerExample'
import { Button } from '../button/Button'
import { sortBy } from '../mock-content/sortby-list'
import { FacetSelect } from '../facets/FacetSelect'
import { FacetRadio } from '../facets/FacetRadio'
import { FacetDatePicker } from '../facets/FacetDatePicker'
import { FacetRange } from '../facets/FacetRange'
import { FacetSearch } from '../facets/FacetSearch'
import { TermSearch } from '../input/TermSearch'

import {
  modalities,
  datasetType_available,
  dataset_type,
  diagnosis_list,
  gender_list,
  species_list,
  section_list,
  domain_list,
} from '../mock-content/facet-content'

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
  const [allKeywords, pushKeyword] = React.useState([])
  const [keywordValue, setKeywordValue] = React.useState('')
  const [modality_selected, setModality] = React.useState()
  const [datasetType_selected, setDatasetsType] = React.useState('All')
  const [datasetStatus_selected, setDatasetStatus] = React.useState()
  const [ageRange, setAgeRange] = React.useState([null, null])
  const [subjectCountRange, setSubjectRange] = React.useState([null, null])
  const [authorValue, setAuthorValue] = React.useState('')
  const [allAuthors, pushAuthor] = React.useState([])
  const [gender_selected, setGender] = React.useState('All')
  const [taskValue, setTaskValue] = React.useState('')
  const [allTasks, pushTask] = React.useState([])
  const [diagnosis_selected, setDiagnosis] = React.useState()
  const [section_selected, setSection] = React.useState()
  const [species_selected, setSpecies] = React.useState()
  const [studyDomain_selected, setDomain] = React.useState()
  const [datePublicizedRange, setSelectedDate] = React.useState([null, null])

  const setSelectedDateValue = value =>
    setSelectedDate(value === null ? [null, null] : value)

  let filterBlockIsEmpty

  if (
    modality_selected === undefined &&
    datasetType_selected === 'All' &&
    datasetStatus_selected === undefined &&
    JSON.stringify(ageRange) === JSON.stringify([null, null]) &&
    JSON.stringify(subjectCountRange) === JSON.stringify([null, null]) &&
    gender_selected === 'All' &&
    diagnosis_selected === undefined &&
    section_selected === undefined &&
    species_selected === undefined &&
    studyDomain_selected === undefined &&
    JSON.stringify(datePublicizedRange) === JSON.stringify([null, null]) &&
    allKeywords.length === 0 &&
    allTasks.length === 0 &&
    allAuthors.length === 0
  ) {
    filterBlockIsEmpty = true
  } else {
    filterBlockIsEmpty = false
  }

  return (
    <div>
      <SearchPage
        portalContent={portalContent}
        renderFilterBlock={() => (
          <>
            {!filterBlockIsEmpty ? (
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
                studyDomain_selected={studyDomain_selected}
                datePublicizedRange={datePublicizedRange}
              />
            ) : null}
          </>
        )}
        renderSortBy={() => (
          <>
            <div className="col results-count">
              Showing All <b>100</b> Public Datasets
            </div>
            <div className="col search-sort">
              <SearchSortContainerExample items={sortBy} />
            </div>
          </>
        )}
        renderSearchFacets={() => (
          <>
            <TermSearch
              className="search-keyword"
              type="text"
              label="Keyword"
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

            <FacetBlockContainerExample>
              {!portalContent && (
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
              )}

              {/* {profile TODO hide Show && My Datasets Status if logged out */}
              <>
                <FacetRadio
                  radioArr={datasetType_available}
                  layout="row"
                  name="show-datasets"
                  startOpen={true}
                  label="Show"
                  accordionStyle="plain"
                  selected={datasetType_selected}
                  setSelected={setDatasetsType}
                  className="dataset-status"
                />
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

              <FacetRange
                startOpen={false}
                label="Age"
                accordionStyle="plain"
                min={0}
                max={100}
                step={10}
                dots={true}
                pushable={5 as unknown as undefined}
                defaultValue={[0, 20]}
                newvalue={ageRange}
                setNewValue={setAgeRange}
              />
              <FacetRange
                startOpen={false}
                label="Number of Subjects"
                accordionStyle="plain"
                min={0}
                max={100}
                step={10}
                dots={true}
                pushable={5 as unknown as undefined}
                defaultValue={[0, 20]}
                newvalue={subjectCountRange}
                setNewValue={setSubjectRange}
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
              <FacetDatePicker
                startOpen={false}
                label="Upload Date"
                accordionStyle="plain"
                selected={datePublicizedRange}
                setSelected={setSelectedDateValue}
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
              <FacetSelect
                selected={studyDomain_selected}
                setSelected={setDomain}
                items={domain_list}
                accordionStyle="plain"
                label="Domain Studied/Ontology"
                startOpen={false}
              />
            </FacetBlockContainerExample>
          </>
        )}
        renderSearchResultsList={() => (
          <>
            <SearchResultsList items={searchResults} profile={profile} />
            <div className="grid grid-nogutter" style={{ width: '100%' }}>
              <div className="col col-12 results-count">
                Showing All <b>100</b> Public Datasets
              </div>
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

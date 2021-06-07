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
  show_available,
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
  const [modality, setModality] = React.useState()
  const [datasetsType, setDatasetsType] = React.useState('All')
  const [datasetStatus, setDatasetStatus] = React.useState()
  const [ageRange, setAgeRange] = React.useState([null, null])
  const [subjectRange, setSubjectRange] = React.useState([null, null])
  const [gender, setGender] = React.useState('All')
  const [diagnosis, setDiagnosis] = React.useState()
  const [section, setSection] = React.useState()
  const [species, setSpecies] = React.useState()
  const [domain, setDomain] = React.useState()
  const [selectedDate, setSelectedDate] = React.useState([null, null])
  const [termValue, setTermValue] = React.useState('')
  const [allTerms, pushTerm] = React.useState([])
  const [authorValue, setAuthorValue] = React.useState('')
  const [allAuthors, pushAuthor] = React.useState([])
  const [taskValue, setTaskValue] = React.useState('')
  const [allTasks, pushTask] = React.useState([])

  const setSelectedDateValue = value =>
    setSelectedDate(value === null ? [null, null] : value)

  let filterBlockIsEmpty

  if (
    modality === undefined &&
    datasetsType === 'All' &&
    datasetStatus === undefined &&
    JSON.stringify(ageRange) === JSON.stringify([null, null]) &&
    JSON.stringify(subjectRange) === JSON.stringify([null, null]) &&
    gender === 'All' &&
    diagnosis === undefined &&
    section === undefined &&
    species === undefined &&
    domain === undefined &&
    JSON.stringify(selectedDate) === JSON.stringify([null, null]) &&
    allTerms.length === 0 &&
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
                allTerms={allTerms}
                allAuthors={allAuthors}
                allTasks={allTasks}
                modality={modality}
                datasetsType={datasetsType}
                datasetStatus={datasetStatus}
                ageRange={ageRange}
                subjectRange={subjectRange}
                gender={gender}
                diagnosis={diagnosis}
                section={section}
                species={species}
                domain={domain}
                selectedDate={selectedDate}
              />
            ) : null}
          </>
        )}
        renderSortBy={() => (
          <>
            <div className="col results-count">
              Showing <b>25</b> of <b>100</b> Datasets
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
              termValue={termValue}
              setTermValue={setTermValue}
              primary={true}
              color="#fff"
              icon="fas fa-plus"
              iconSize="20px"
              size="small"
              pushTerm={pushTerm}
              allTerms={allTerms}
            />

            <FacetBlockContainerExample>
              {!portalContent && (
                <FacetSelect
                  selected={modality}
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
                  radioArr={show_available}
                  layout="row"
                  name="show-datasets"
                  startOpen={true}
                  label="Show"
                  accordionStyle="plain"
                  selected={datasetsType}
                  setSelected={setDatasetsType}
                  className="dataset-status"
                />
                <FacetSelect
                  selected={datasetStatus}
                  setSelected={setDatasetStatus}
                  items={dataset_type}
                  accordionStyle="plain"
                  label="My Datasets Status"
                  startOpen={true}
                  className={
                    datasetsType == 'My Datasets'
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
                newvalue={subjectRange}
                setNewValue={setSubjectRange}
              />
              <FacetSelect
                selected={diagnosis}
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
                selected={gender}
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
                label="Date"
                accordionStyle="plain"
                selected={selectedDate}
                setSelected={setSelectedDateValue}
              />
              <FacetSelect
                selected={species}
                setSelected={setSpecies}
                items={species_list}
                accordionStyle="plain"
                label="Species"
                startOpen={false}
              />
              <FacetSelect
                selected={section}
                setSelected={setSection}
                items={section_list}
                accordionStyle="plain"
                label="Section"
                startOpen={false}
              />
              <FacetSelect
                selected={domain}
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
                Showing <b>25</b> of <b>100</b> Datasets
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

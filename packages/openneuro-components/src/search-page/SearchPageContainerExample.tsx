import React from 'react'
import { FacetBlockContainerExample } from './FacetBlockContainerExample'
import { SearchResultsList } from './SearchResultsList'
import { FiltersBlock } from './FiltersBlock'
import { SearchPage } from './SearchPage'
import { SearchSortContainerExample } from './SearchSortContainerExample'
import { KeywordInputContainerExample } from './KeywordInputContainerExample'
import { sortBy } from '../mock-content/sortby-list'
import { FacetSelect } from '../facets/FacetSelect'
import { FacetRadio } from '../facets/FacetRadio'
import { FacetDatePicker } from '../facets/FacetDatePicker'
import { FacetRange } from '../facets/FacetRange'
import { Button } from '../button/Button'

import {
  modalities,
  show_available,
  dataset_type,
  diagnosis_list,
  task_list,
  author_pi_list,
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
  const [author_pi, setAuthor_pi] = React.useState()
  const [gender, setGender] = React.useState('All')
  const [task, setTask] = React.useState()
  const [diagnosis, setDiagnosis] = React.useState()
  const [section, setSection] = React.useState()
  const [species, setSpecies] = React.useState()
  const [domain, setDomain] = React.useState()
  const [selectedDate, setSelectedDate] = React.useState([null, null])

  let filterBlockIsEmpty

  if (
    modality === undefined &&
    datasetsType === 'All' &&
    datasetStatus === undefined &&
    JSON.stringify(ageRange) === JSON.stringify([null, null]) &&
    JSON.stringify(subjectRange) === JSON.stringify([null, null]) &&
    author_pi === undefined &&
    gender === 'All' &&
    task === undefined &&
    diagnosis === undefined &&
    section === undefined &&
    species === undefined &&
    domain === undefined &&
    JSON.stringify(selectedDate) === JSON.stringify([null, null])
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
                modality={modality}
                datasetsType={datasetsType}
                datasetStatus={datasetStatus}
                ageRange={ageRange}
                subjectRange={subjectRange}
                author_pi={author_pi}
                gender={gender}
                task={task}
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
            <KeywordInputContainerExample searchValue={'Forrest Gump'} />
            <FacetBlockContainerExample>
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
                  className={
                    datasetsType == 'My Datasets' ? 'dataset-status-open' : null
                  }
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

              {!portalContent && (
                <FacetSelect
                  selected={modality}
                  setSelected={setModality}
                  items={modalities}
                  accordionStyle="plain"
                  label="Modalities"
                  startOpen={true}
                />
              )}
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
              <FacetSelect
                selected={task}
                setSelected={setTask}
                items={task_list}
                accordionStyle="plain"
                label="Task"
                startOpen={false}
              />
              <FacetSelect
                selected={author_pi}
                setSelected={setAuthor_pi}
                items={author_pi_list}
                accordionStyle="plain"
                label="Sr. Author / PI"
                startOpen={false}
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
                setSelected={setSelectedDate}
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
            <div className="col  col-center results-count">
              Showing <b>25</b> of <b>100</b> Datasets
            </div>
            <div className=" load-more ">
              <Button label="Load More" />
            </div>
          </>
        )}
      />
    </div>
  )
}

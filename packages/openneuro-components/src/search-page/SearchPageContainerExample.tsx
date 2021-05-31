import React from 'react'
import { FacetBlockContainerExample } from './FacetBlockContainerExample'
import { SearchResults } from './SearchResults'
import { FiltersBlock } from './FiltersBlock'
import { SearchPage } from './SearchPage'
import { SearchSortContainerExample } from './SearchSortContainerExample'
import { KeywordInputContainerExample } from './KeywordInputContainerExample'
import { sortBy } from '../mock-content/sortby-list'
import { FacetSelect } from '../facets/FacetSelect'
import { FacetRadio } from '../facets/FacetRadio'
import { FacetRange } from '../facets/FacetRange'

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
  const [datasetsType, setDatasetsType] = React.useState('all')
  const [datasetStatus, setDatasetStatus] = React.useState()
  const [ageRange, setAgeRange] = React.useState([0, 20])
  const [subjectRange, setSubjectRange] = React.useState([0, 20])
  const [author_pi, setAuthor_pi] = React.useState()
  const [gender, setGender] = React.useState('all')
  const [task, setTask] = React.useState()
  const [diagnosis, setDiagnosis] = React.useState()
  const [section, setSection] = React.useState(0)
  const [species, setSpecies] = React.useState()
  const [domain, setDomain] = React.useState()

  return (
    <div>
      <SearchPage
        portalContent={portalContent}
        renderSortBy={() => (
          <>
            <div className="col">
              <b>
                100 Datasets found for "<span>Forrest Gump</span>"
              </b>
            </div>
            <div className="col">
              <div className="search-sort">
                <SearchSortContainerExample items={sortBy} />
              </div>
            </div>
          </>
        )}
        renderSearchFacets={() => (
          <>
            <KeywordInputContainerExample searchValue={'Forrest Gump'} />
            <FiltersBlock
              datasetsType={'My Datasets'}
              ageRange={[0, 20]}
              author_pi={'Charles Darwin'}
              gender={'Male'}
              task={'T1w'}
              species={'Human'}
            />
            <FacetBlockContainerExample>
              <FacetSelect
                selected={modality}
                setSelected={setModality}
                items={modalities}
                accordionStyle="plain"
                label="Modalities"
                startOpen={true}
              />

              <FacetRadio
                radioArr={show_available}
                layout="row"
                name="show-datasets"
                startOpen={true}
                label="Show"
                accordionStyle="plain"
                selected={datasetsType}
                setSelected={setDatasetsType}
              />

              {datasetsType == 2 ? (
                <FacetSelect
                  selected={datasetStatus}
                  setSelected={setDatasetStatus}
                  items={dataset_type}
                  accordionStyle="plain"
                  label="My Datasets Status"
                  startOpen={false}
                />
              ) : null}

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
        renderSearchResults={() => (
          <>
            <SearchResults items={searchResults} profile={profile} />
            <div className="col  col-center results-count">
              <b>
                100 Datasets found for "<span>Forrest Gump</span>"
              </b>
            </div>
          </>
        )}
      />
    </div>
  )
}

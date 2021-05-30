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
  showMyUploads_available,
  diagnosis,
  task,
  author_pi,
  gender,
  species,
  section,
  domain,
} from '../mock-content/facet-content'
import { AccordionWrap } from '../accordion/AccordionWrap'
import { AccordionTab } from '../accordion/AccordionTab'

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
  const [selected, setSelected] = React.useState()
  const [active, setActive] = React.useState(0)
  const [newvalue, setNewValue] = React.useState([0, 20])
  console.log(active)
  return (
    <div>
      <SearchPage
        portalContent={portalContent}
        renderSortBy={() => (
          <>
            <div className="col">
              <b>
                100 Datasets found for "<span>MRI</span>"
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
            <KeywordInputContainerExample searchValue={'MRI'} />
            <FiltersBlock />
            <FacetBlockContainerExample>
              <FacetSelect
                selected={selected}
                setSelected={setSelected}
                items={modalities}
                accordionStyle="plain"
                label="Modalities"
                startOpen={false}
              />

              <FacetRadio
                radioArr={show_available}
                layout="row"
                name="show-datasets"
                startOpen={false}
                label="Show"
                accordionStyle="plain"
                active={active}
                setActive={setActive}
              />

              {active == 2 ? (
                <FacetSelect
                  selected={selected}
                  setSelected={setSelected}
                  items={showMyUploads_available}
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
                pushable={5}
                defaultValue={[0, 20]}
                newvalue={newvalue}
                setNewValue={setNewValue}
              />
              <FacetRange
                startOpen={false}
                label="Number of Subjects"
                accordionStyle="plain"
                min={0}
                max={100}
                step={10}
                dots={true}
                pushable={5}
                defaultValue={[0, 20]}
                newvalue={newvalue}
                setNewValue={setNewValue}
              />

              <FacetSelect
                selected={selected}
                setSelected={setSelected}
                items={diagnosis}
                accordionStyle="plain"
                label="Diagnosis"
                startOpen={false}
              />

              <FacetSelect
                selected={selected}
                setSelected={setSelected}
                items={task}
                accordionStyle="plain"
                label="Task"
                startOpen={false}
              />

              <FacetSelect
                selected={selected}
                setSelected={setSelected}
                items={author_pi}
                accordionStyle="plain"
                label="Sr. Author / PI"
                startOpen={false}
              />

              <FacetRadio
                radioArr={gender}
                layout="row"
                name="Gender"
                startOpen={false}
                label="Gender"
                accordionStyle="plain"
                active={active}
                setActive={setActive}
              />
              <FacetSelect
                selected={selected}
                setSelected={setSelected}
                items={species}
                accordionStyle="plain"
                label="Species"
                startOpen={false}
              />
              <FacetSelect
                selected={selected}
                setSelected={setSelected}
                items={section}
                accordionStyle="plain"
                label="Section"
                startOpen={false}
              />
              <FacetSelect
                selected={selected}
                setSelected={setSelected}
                items={domain}
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
                100 Datasets found for "<span>MRI</span>"
              </b>
            </div>
          </>
        )}
      />
    </div>
  )
}

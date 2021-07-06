import React from 'react'
import { Button } from '../button/Button'
import { FilterListItem } from './FilterListItem'
import { FilterDateItem } from './FilterDateItem'
import { TermListItem } from './TermListItem'
import { FacetSelectValueType } from '../facets/FacetSelect'
import './filters-block.scss'

export interface FiltersBlockProps {
  keywords: string[]
  modality_selected?: FacetSelectValueType
  datasetType_selected?: string
  datasetStatus_selected?: FacetSelectValueType
  ageRange?: [number, number]
  subjectCountRange?: [number, number]
  authors: string[]
  gender_selected?: string
  date_selected?: string
  tasks: string[]
  diagnosis_selected?: FacetSelectValueType
  section_selected?: FacetSelectValueType
  species_selected?: FacetSelectValueType
  studyDomain_selected?: FacetSelectValueType
  removeFilterItem?(isModality?: boolean): (key: string, value) => void
  removeAllFilters?(): void
  numTotalResults: number
}

export const FiltersBlock = ({
  keywords,
  modality_selected,
  datasetType_selected,
  datasetStatus_selected,
  ageRange,
  subjectCountRange,
  authors,
  gender_selected,
  tasks,
  diagnosis_selected,
  section_selected,
  species_selected,
  studyDomain_selected,
  date_selected,
  removeFilterItem,
  removeAllFilters,
  numTotalResults,
}: FiltersBlockProps) => {
  const ageRangeIsNull =
    JSON.stringify(ageRange) === JSON.stringify([null, null])
  const subjectCountRangeIsNull =
    JSON.stringify(subjectCountRange) === JSON.stringify([null, null])

  return (
    <div className="filters-block">
      <h4>
        {modality_selected ||
        datasetType_selected !== 'All Public' ||
        !ageRangeIsNull ||
        !subjectCountRangeIsNull ||
        gender_selected !== 'All' ||
        date_selected !== 'All Time' ||
        diagnosis_selected !== null ||
        section_selected !== null ||
        species_selected !== null ||
        studyDomain_selected !== null ||
        keywords.length !== 0 ||
        tasks.length !== 0 ||
        authors.length !== 0 ? (
          <>
            These filters return <span>{numTotalResults}</span> results:{' '}
            <Button label="Clear All" size="small" onClick={removeAllFilters} />
          </>
        ) : (
          <b>Showing all available datasets</b>
        )}
      </h4>
      <ul className="active-filters">
        {keywords && (
          <TermListItem
            type="Keyword"
            item={{ param: 'keywords', values: keywords }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {modality_selected && (
          <FilterListItem
            type="Modality"
            item={{ param: 'modality_selected', value: modality_selected }}
            removeFilterItem={removeFilterItem(true)}
          />
        )}
        {datasetType_selected && (
          <FilterListItem
            type="Type"
            item={{
              param: 'datasetType_selected',
              value: datasetType_selected,
            }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {datasetStatus_selected && (
          <FilterListItem
            type="Status"
            item={{
              param: 'datasetStatus_selected',
              value: datasetStatus_selected,
            }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {!ageRangeIsNull && (
          <FilterListItem
            type="Age"
            item={{ param: 'ageRange', value: ageRange }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {!subjectCountRangeIsNull && (
          <FilterListItem
            type="Participants"
            item={{ param: 'subjectCountRange', value: subjectCountRange }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {authors && (
          <TermListItem
            type="Authors/PI"
            item={{ param: 'authors', values: authors }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {gender_selected && (
          <FilterListItem
            type="Gender"
            item={{ param: 'gender_selected', value: gender_selected }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {tasks && (
          <TermListItem
            type="Task"
            item={{ param: 'tasks', values: tasks }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {diagnosis_selected && (
          <FilterListItem
            type="Diagnosis"
            item={{ param: 'diagnosis_selected', value: diagnosis_selected }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {section_selected && (
          <FilterListItem
            type="Section"
            item={{ param: 'section_selected', value: section_selected }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {species_selected && (
          <FilterListItem
            type="Species"
            item={{ param: 'species_selected', value: species_selected }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {studyDomain_selected && (
          <FilterListItem
            type="Ontology"
            item={{
              param: 'studyDomain_selected',
              value: studyDomain_selected,
            }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {date_selected && (
          <FilterListItem
            type="Publication Date "
            item={{ param: 'date_selected', value: date_selected }}
            removeFilterItem={removeFilterItem()}
          />
        )}
      </ul>
    </div>
  )
}

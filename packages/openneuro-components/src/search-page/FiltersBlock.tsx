import React from 'react'
import { Button } from '../button/Button'
import { FilterListItem } from './FilterListItem'
import { FilterDateItem } from './FilterDateItem'
import { TermListItem } from './TermListItem'
import './filters-block.scss'

export interface FiltersBlockProps {
  allTerms: string[]
  modality_selected?: { label: string; value: string }
  datasetType_selected?: string
  datasetStatus_selected?: { label: string; value: string }
  ageRange?: [number, number]
  subjectCountRange?: [number, number]
  allAuthors: string[]
  gender_selected?: string
  allTasks: string[]
  diagnosis_selected?: { label: string; value: string }
  section_selected?: { label: string; value: string }
  species_selected?: { label: string; value: string }
  studyDomain_selected?: { label: string; value: string }
  datePublicizedRange?: [Date | null, Date | null]
  removeFilter?(key: string, value): void
  removeAllFilters?(): void
}

export const FiltersBlock = ({
  allTerms,
  modality_selected,
  datasetType_selected,
  datasetStatus_selected,
  ageRange,
  subjectCountRange,
  allAuthors,
  gender_selected,
  allTasks,
  diagnosis_selected,
  section_selected,
  species_selected,
  studyDomain_selected,
  datePublicizedRange,
  removeFilter,
  removeAllFilters,
}: FiltersBlockProps) => {
  const _listItem = (type, item) => {
    if (item === 'All') {
      return
    } else
      return (
        <>
          <li className={type}>
            <strong>{type}:</strong>
            <span>
              {type === 'Age' || type === 'Subjects'
                ? item[0] + ' - ' + item[1]
                : item}
              <span>&times;</span>
            </span>
          </li>
        </>
      )
  }
  const ageRangeIsNull =
    JSON.stringify(ageRange) === JSON.stringify([null, null])
  const subjectCountRangeIsNull =
    JSON.stringify(subjectCountRange) === JSON.stringify([null, null])

  const dateIsNull =
    JSON.stringify(datePublicizedRange) === JSON.stringify([null, null])

  return (
    <div className="filters-block">
      <ul className="active-filters">
        {allTerms && <TermListItem item={allTerms} type="Keyword" />}
        {modality_selected && <FilterListItem item={modality_selected} type="Modality" />}
        {datasetType_selected && <FilterListItem item={datasetType_selected} type="Type" />}
        {datasetStatus_selected && <FilterListItem item={datasetStatus_selected} type="Status" />}
        {!ageRangeIsNull && <FilterListItem item={ageRange} type="Age" />}
        {!subjectCountRangeIsNull && (
          <FilterListItem item={subjectCountRange} type="Subjects" />
        )}
        {allAuthors && <TermListItem item={allAuthors} type="Authors/PI" />}
        {gender_selected && <FilterListItem item={gender_selected} type="Gender" />}
        {allTasks && <TermListItem item={allTasks} type="Task" />}
        {gender_selected && <FilterListItem item={gender_selected} type="Gender" />}
        {diagnosis_selected && <FilterListItem item={diagnosis_selected} type="Diagnosis" />}
        {section_selected && <FilterListItem item={section_selected} type="Section" />}
        {species_selected && <FilterListItem item={species_selected} type="Species" />}
        {studyDomain_selected && <FilterListItem item={studyDomain_selected} type="Domain" />}
        {!dateIsNull && <FilterDateItem item={datePublicizedRange} type="Date" />}

        <li>
          <Button label="Clear All" size="small" onClick={removeAllFilters} />
        </li>
      </ul>
    </div>
  )
}

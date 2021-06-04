import React from 'react'
import { Button } from '../button/Button'
import { FilterListItem } from './FilterListItem'
import { TermListItem } from './TermListItem'
import './filters-block.scss'

export interface FiltersBlockProps {
  modality?: { label: string; value: string }
  datasetsType?: string
  datasetStatus?: { label: string; value: string }
  ageRange?: [number, number]
  subjectRange?: [number, number]
  gender?: string
  task?: { label: string; value: string }
  diagnosis?: { label: string; value: string }
  section?: { label: string; value: string }
  species?: { label: string; value: string }
  domain?: { label: string; value: string }
  selectedDate?: [Date | null, Date | null]
  allTerms: string[]
  allAuthors: string[]
  allTasks: string[]
}

export const FiltersBlock = ({
  modality,
  datasetsType,
  datasetStatus,
  ageRange,
  subjectRange,
  gender,
  diagnosis,
  section,
  species,
  domain,
  selectedDate,
  allTerms,
  allAuthors,
  allTasks,
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
  const subjectRangeIsNull =
    JSON.stringify(subjectRange) === JSON.stringify([null, null])

  const dateIsNull =
    JSON.stringify(selectedDate) === JSON.stringify([null, null])

  const startDay = !dateIsNull && selectedDate[0].getDate()
  const endDay = !dateIsNull && selectedDate[1].getDate()
  const startMonth = !dateIsNull && selectedDate[0].getMonth()
  const endMonth = !dateIsNull && selectedDate[1].getMonth()
  const startYear = !dateIsNull && selectedDate[0].getFullYear()
  const endYear = !dateIsNull && selectedDate[1].getFullYear()

  return (
    <div className="filters-block">
      <ul className="active-filters">
        {allTerms && <TermListItem item={allTerms} type="Keyword" />}
        {modality && <FilterListItem item={modality} type="Modality" />}
        {datasetsType && <FilterListItem item={datasetsType} type="Type" />}
        {datasetStatus && <FilterListItem item={datasetStatus} type="Status" />}
        {!ageRangeIsNull && <FilterListItem item={ageRange} type="Age" />}
        {!dateIsNull && <FilterListItem item={subjectRange} type="Subjects" />}
        {allAuthors && <TermListItem item={allAuthors} type="Authors/PI" />}
        {gender && <FilterListItem item={gender} type="Gender" />}
        {allTasks && <TermListItem item={allTasks} type="Task" />}
        {gender && <FilterListItem item={gender} type="Gender" />}
        {diagnosis && <FilterListItem item={diagnosis} type="Diagnosis" />}
        {section && <FilterListItem item={section} type="Section" />}
        {species && <FilterListItem item={species} type="Species" />}
        {domain && <FilterListItem item={domain} type="Domain" />}

        <li>
          <Button label="Clear All" size="small" />
        </li>
      </ul>
    </div>
  )
}

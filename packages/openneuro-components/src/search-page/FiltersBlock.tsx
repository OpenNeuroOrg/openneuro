import React from 'react'
import { Button } from '../button/Button'
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
  task,
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
        {allTerms.length ? (
          <li className="search-term-list">
            <strong className="terms-heading">Search Term:</strong>
            <ul>
              {allTerms.map((item, index) => (
                <li key={index}>
                  <span>
                    {item}
                    <span>&times;</span>
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ) : null}
        {modality && _listItem('Modality', modality)}
        {datasetsType && _listItem('Type', datasetsType)}
        {datasetStatus && _listItem('Status', datasetStatus)}
        {ageRange && !ageRangeIsNull && _listItem('Age', ageRange)}
        {subjectRange &&
          !subjectRangeIsNull &&
          _listItem('Subjects', subjectRange)}
        {allAuthors.length ? (
          <li className="search-term-list">
            <strong className="terms-heading">Authors/PI:</strong>
            <ul>
              {allAuthors.map((item, index) => (
                <li key={index}>
                  <span>
                    {item}
                    <span>&times;</span>
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ) : null}
        {gender && _listItem('Gender', gender)}
        {allTasks.length ? (
          <li className="search-term-list">
            <strong className="terms-heading">Task</strong>
            <ul>
              {allTasks.map((item, index) => (
                <li key={index}>
                  <span>
                    {item}
                    <span>&times;</span>
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ) : null}
        {diagnosis && _listItem('Diagnosis', diagnosis)}
        {section && _listItem('Section', section)}
        {species && _listItem('Species', species)}
        {domain && _listItem('Domain', domain)}
        {subjectRange && !dateIsNull && (
          <li className="Date-Range">
            <strong>Date:</strong>
            <span>
              {startMonth}/{startDay}/{startYear} - {endMonth}/{endDay}/
              {endYear}
              <span>&times;</span>
            </span>
          </li>
        )}
        <li>
          <Button label="Clear All" size="small" />
        </li>
      </ul>
    </div>
  )
}

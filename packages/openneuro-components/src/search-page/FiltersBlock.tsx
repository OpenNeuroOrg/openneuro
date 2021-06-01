import React from 'react'
import { Button } from '../button/Button'
import './filters-block.scss'

export interface FiltersBlockProps {
  modality?: string
  datasetsType?: string
  datasetStatus?: string
  ageRange?: [number, number]
  subjectRange?: [number, number]
  author_pi?: string
  gender?: string
  task?: string
  diagnosis?: string
  section?: string
  species?: string
  domain?: string
  selectedDate?: string[]
}

export const FiltersBlock = ({
  modality,
  datasetsType,
  datasetStatus,
  ageRange,
  subjectRange,
  author_pi,
  gender,
  task,
  diagnosis,
  section,
  species,
  domain,
  selectedDate,
}: FiltersBlockProps) => {
  console.log(selectedDate)
  const _listItem = (type, item) => {
    return (
      <>
        <li>
          <strong>{type}:</strong>
          {type === 'Age' || type === 'Subjects'
            ? item[0] + ' - ' + item[1]
            : item}
          <span>&times;</span>
        </li>
      </>
    )
  }
  return (
    <div className="filters-block">
      <ul className="active-filters">
        {modality && _listItem('Modality', modality)}
        {datasetsType && _listItem('Type', datasetsType)}
        {datasetStatus && _listItem('Status', datasetStatus)}
        {ageRange && _listItem('Age', ageRange)}
        {subjectRange && _listItem('Subjects', subjectRange)}
        {author_pi && _listItem('Author/PI', author_pi)}
        {gender && _listItem('Gender', gender)}
        {task && _listItem('Task', task)}
        {diagnosis && _listItem('Diagnosis', diagnosis)}
        {section && _listItem('Section', section)}
        {species && _listItem('Species', species)}
        {domain && _listItem('Domain', domain)}
      </ul>
      <Button label="Clear All" size="small" />
    </div>
  )
}

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
}: FiltersBlockProps) => {
  const _listItem = (type, item) => {
    return (
      <>
        <li>
          <strong>{type}:</strong>
          {item}
          <span>&times;</span>
        </li>
      </>
    )
  }
  return (
    <div className="filters-block">
      <ul className="active-filters">
        {modality && _listItem('modality', modality)}
        {datasetsType && _listItem('datasetsType', datasetsType)}
        {datasetStatus && _listItem('datasetStatus', datasetStatus)}
        {ageRange && _listItem('ageRange', ageRange)}
        {subjectRange && _listItem('subjectRange', subjectRange)}
        {author_pi && _listItem('author_pi', author_pi)}
        {gender && _listItem('gender', gender)}
        {task && _listItem('task', task)}
        {diagnosis && _listItem('diagnosis', diagnosis)}
        {section && _listItem('section', section)}
        {species && _listItem('species', species)}
        {domain && _listItem('domain', domain)}
      </ul>
      <Button label="Clear All" size="small" />
    </div>
  )
}

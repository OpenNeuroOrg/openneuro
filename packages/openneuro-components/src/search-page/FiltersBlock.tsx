import React from 'react'
import { Button } from '../button/Button'
import './filters-block.scss'

export interface FiltersBlockProps {}

export const FiltersBlock = ({}: FiltersBlockProps) => {
  return (
    <>
      <ul className="active-filters">
        <li>
          <strong>Modality:</strong>Functional<span>&times;</span>
        </li>
        <li>
          <strong>Gender:</strong>Male<span>&times;</span>
        </li>
        <li>
          <strong>Task:</strong>Coordsystems<span>&times;</span>
        </li>
        <li>
          <strong>Age:</strong>20-40<span>&times;</span>
        </li>
      </ul>
      <Button label="Clear All" size="small" />
    </>
  )
}

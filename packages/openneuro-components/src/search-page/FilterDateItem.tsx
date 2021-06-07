import React from 'react'

type DateRange = [Date | null, Date | null]

export interface FilterDateItemProps {
  item: DateRange
  type?: string
}
export const FilterDateItem = ({ item, type }: FilterDateItemProps) => {
  const dateIsNull = JSON.stringify(item) === JSON.stringify(null)
  const startDay = !dateIsNull && item[0].getDate()
  const endDay = !dateIsNull && item[1].getDate()
  const startMonth = !dateIsNull && item[0].getMonth() + 1
  const endMonth = !dateIsNull && item[1].getMonth() + 1
  const startYear = !dateIsNull && item[0].getFullYear()
  const endYear = !dateIsNull && item[1].getFullYear()

  if (dateIsNull) {
    return null
  } else
    return (
      <>
        <li className={type}>
          <strong>{type}:</strong>
          <span>
            {startMonth}/{startDay}/{startYear} - {endMonth}/{endDay}/{endYear}
            <span>&times;</span>
          </span>
        </li>
      </>
    )
}

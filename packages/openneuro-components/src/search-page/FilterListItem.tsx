import React from 'react'

type TextList = string[]
type Text = string
type NumberCouple = [number, number]
type DateRange = [Date | null, Date | null]
type OptionObject = { label: string; value: string }

export interface FilterListItemProps {
  item: TextList | Text | DateRange | OptionObject | NumberCouple
  type?: string
}
export const FilterListItem = ({ item, type }: FilterListItemProps) => {
  if (item === 'All' || JSON.stringify(item) === JSON.stringify([null, null])) {
    return null
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

import React from 'react'

type TextList = string[]
type Text = string
type NumberCouple = [number, number]
type OptionObject = { label: string; value: string }
type Item = {
  param: string
  value: TextList | Text | OptionObject | NumberCouple
}

export interface FilterListItemProps {
  item: Item
  type?: string
  removeFilterItem?(param, value): void
}
export const FilterListItem = ({
  item,
  type,
  removeFilterItem = () => {},
}: FilterListItemProps) => {
  if (
    item.value === 'All' ||
    item.value === 'All Public' ||
    JSON.stringify(item.value) === JSON.stringify([null, null])
  ) {
    return null
  } else
    return (
      <>
        <li className={type}>
          <strong>{type}:</strong>
          <span>
            {type === 'Age' || type === 'Subjects'
              ? item.value[0] + ' - ' + item.value[1]
              : item.value}
            <span onClick={() => removeFilterItem(item.param, item.value)}>
              &times;
            </span>
          </span>
        </li>
      </>
    )
}

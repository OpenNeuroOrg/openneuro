import React from "react"

type DateRange = [Date | null, Date | null]
type Item = {
  param: string
  value: DateRange
}

export interface FilterDateItemProps {
  item: Item
  type?: string
  removeFilterItem?(param, value): void
}
export const FilterDateItem = ({
  item,
  type,
  removeFilterItem = () => {},
}: FilterDateItemProps) => {
  const dateIsNull = JSON.stringify(item) === JSON.stringify([null, null])
  const startDay = !dateIsNull && item[0].getDate()
  const endDay = !dateIsNull && item[1].getDate()
  const startMonth = !dateIsNull && item[0].getMonth() + 1
  const endMonth = !dateIsNull && item[1].getMonth() + 1
  const startYear = !dateIsNull && item[0].getFullYear()
  const endYear = !dateIsNull && item[1].getFullYear()

  if (dateIsNull) {
    return null
  } else {
    return (
      <>
        <li className={type}>
          <strong>{type}:</strong>
          <span>
            {startMonth}/{startDay}/{startYear} - {endMonth}/{endDay}/{endYear}
            <span onClick={() => removeFilterItem(item.param, item.value)}>
              &times;
            </span>
          </span>
        </li>
      </>
    )
  }
}

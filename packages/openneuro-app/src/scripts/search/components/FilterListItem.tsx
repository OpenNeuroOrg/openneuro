import React from "react"
import { ModalityLabel } from "../../components/formatting/modality-label"

type TextList = string[]
type Text = string
type NumberCouple = [number, number]
type OptionObject = { label: string; value: string }
type Item = {
  param: string
  value: TextList | Text | OptionObject | NumberCouple
}

const rangeDisplay = (range) => {
  if (range[0] === null) {
    return `<= ${range[1]}`
  } else if (range[1] === null) {
    return `>= ${range[0]}`
  } else {
    return `${range[0]} - ${range[1]}`
  }
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
    item.value === "All" ||
    item.value === "All Public" ||
    item.value === "All Time" ||
    JSON.stringify(item.value) === JSON.stringify([null, null])
  ) {
    return null
  } else {
    let value: string | TextList | OptionObject | NumberCouple | JSX.Element =
      item.value
    if (type === "Modality" && typeof item.value === "string") {
      value = <ModalityLabel modality={item.value} />
    } else if (type === "Age" || type === "Participants") {
      value = rangeDisplay(item.value)
    }
    return (
      <>
        <li className={type}>
          <strong>{type}:</strong>
          <span>
            {value}
            <span onClick={() => removeFilterItem(item.param, item.value)}>
              &times;
            </span>
          </span>
        </li>
      </>
    )
  }
}

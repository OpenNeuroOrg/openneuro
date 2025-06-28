import React from "react"
import { Dropdown } from "../../components/dropdown/Dropdown"
import "../scss/search-sort.scss"

export interface SearchSortProps {
  items: {
    label: string
    value: string
  }[]

  selected: {
    label: string
    value: string
  }
  setSelected: (selected: { label: string; value: string }) => void
}

export const SearchSort = ({
  items,
  selected,
  setSelected,
}: SearchSortProps) => {
  return (
    <div className="col search-sort">
      <Dropdown
        label={
          <div className="search-sort-list-label">
            <b>SORT BY:</b> {selected.label}
            <i className="fas fa-exchange-alt fa-rotate-90" />
          </div>
        }
        children={
          <div className="search-sort-dropdown-list">
            <ul>
              {items.map((item, index) => (
                <li
                  key={index}
                  onClick={() => setSelected(item)}
                >
                  {selected.value === item.value && (
                    <i className="fas fa-check" />
                  )}
                  <span className="label">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        }
      />
    </div>
  )
}

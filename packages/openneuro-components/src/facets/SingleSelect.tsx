import React from "react"

export interface SingleSelectProps {
  items: string[]
  className?: string
  label?: string
  selected: string | null
  setSelected: (selected: string | null) => void
}

export const SingleSelect = ({
  items,
  className,
  label,
  selected,
  setSelected,
}: SingleSelectProps) => {
  const handleSelect = (e: React.MouseEvent, value: string) => {
    e.stopPropagation()
    setSelected(value)
  }

  return (
    <div className={className}>
      <ul className="single-select-list">
        {items.map((item, index) => (
          <li
            key={index}
            onClick={(e) => handleSelect(e, item)}
            className={selected === item ? "selected-item" : "item"}
          >
            {label ? label : item}
          </li>
        ))}
      </ul>
    </div>
  )
}

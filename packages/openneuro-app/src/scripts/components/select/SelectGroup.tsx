import React from "react"
import "./select.scss"

export interface SelectGroupProps {
  options: {
    label: string
    value: string
  }[]
  value: string
  setValue: (value: string) => void
  label?: string
  id: string
  layout: "inline" | "stacked"
}

export const SelectGroup = ({
  setValue,
  options,
  label,
  id,
  layout,
  value,
}: SelectGroupProps) => {
  return (
    <span
      className={layout === "stacked"
        ? "on-select-wrapper stacked"
        : "on-select-wrapper"}
    >
      {label && <label htmlFor={id}>{label}</label>}
      <select
        className="on-select"
        id={id}
        value={value} // ✅ Keep the select controlled
        onChange={(e) => setValue(e.target.value)}
      >
        {options.map((item, index) => (
          <option key={index} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </span>
  )
}

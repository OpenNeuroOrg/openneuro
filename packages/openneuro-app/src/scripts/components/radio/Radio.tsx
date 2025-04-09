import React from "react"
import "./radio.scss"

export interface RadioProps {
  label: string
  name: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  checked: boolean
  value: string
}

export const Radio = ({
  label,
  name,
  onChange,
  checked,
  value,
}: RadioProps) => {
  const id = name + "-" + label
  return (
    <span className="custom-radio">
      <input
        type="radio"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        value={value}
      />
      <label htmlFor={id}>{label}</label>
    </span>
  )
}

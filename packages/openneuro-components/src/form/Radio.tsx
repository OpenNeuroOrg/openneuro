import React from 'react'
import './forms.scss'

export interface RadioProps {
  label: string
  name: string
  onClick?: React.MouseEventHandler<HTMLInputElement>
  checked: boolean
  value: string
}

export const Radio = ({ label, name, onClick, checked, value }: RadioProps) => {
  const id = name + '-' + label
  return (
    <span className="custom-radio">
      <input
        type="radio"
        id={id}
        name={name}
        checked={checked}
        onClick={onClick}
        value={value}
      />
      <label htmlFor={id}>{label}</label>
    </span>
  )
}

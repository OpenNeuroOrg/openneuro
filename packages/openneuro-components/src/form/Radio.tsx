import React from 'react'
import './forms.scss'

export interface RadioProps {
  elementId?: string
  label: string
  radioGroupName: string
  radioNumber: string
  onClick?: () => void
  checked: boolean
}

export const Radio: React.FC<RadioProps> = ({
  elementId,
  label,
  radioGroupName,
  radioNumber,
  onClick,
  checked,
  ...props
}) => {
  return (
    <span className="custom-radio">
      <input
        type="radio"
        id={elementId}
        name={radioGroupName}
        checked={checked}
        onClick={onClick}
        value={label}
      />
      <label htmlFor={elementId}>{label}</label>
    </span>
  )
}

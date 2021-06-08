import React from 'react'
import './input.scss'

export interface InputProps {
  placeholder: string
  type: string
  disabled: boolean
  label?: string
  name: string
  labelStyle?: 'inline' | 'float' | 'default'
  value: string
  setValue: string
  onKeyDown?(event): void
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  type,
  label,
  name,
  labelStyle,
  setValue,
  value,
  onKeyDown = () => {},
}) => {
  return (
    <>
      {labelStyle == 'float' ? (
        <div className="form-control float-form-style">
          <input
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={e => setValue(e.target.value)}
            onKeyDown={onKeyDown}
          />
          {label ? <label htmlFor={name}>{label}</label> : null}
        </div>
      ) : labelStyle == 'inline' ? (
        <div className="form-control inline">
          {label ? <label htmlFor={name}>{label}</label> : null}
          <input
            value={value}
            type={type}
            name={name}
            placeholder={placeholder}
            onChange={e => setValue(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
      ) : (
        <div className="form-control ">
          {label ? <label htmlFor={name}>{label}</label> : null}
          <input
            value={value}
            type={type}
            name={name}
            placeholder={placeholder}
            onChange={e => setValue(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
      )}
    </>
  )
}

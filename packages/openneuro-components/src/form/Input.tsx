import React from 'react'
import './forms.scss'

export interface InputProps {
  placeholder: string
  type: string
  disabled: boolean
  label?: string
  name: string
  inline?: boolean
  labelStyle?: 'inline' | 'float' | 'default'
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  type,
  label,
  name,
  inline,
  labelStyle,
  ...props
}) => {
  return (
    <>
      {labelStyle == 'float' ? (
        <div className="form-control float-form-style">
          <input type={type} name={name} placeholder={placeholder} {...props} />
          {label ? <label htmlFor={name}>{label}</label> : null}
        </div>
      ) : labelStyle == 'inline' ? (
        <div className="form-control inline">
          {label ? <label htmlFor={name}>{label}</label> : null}
          <input type={type} name={name} placeholder={placeholder} {...props} />
        </div>
      ) : (
        <div className="form-control ">
          {label ? <label htmlFor={name}>{label}</label> : null}
          <input type={type} name={name} placeholder={placeholder} {...props} />
        </div>
      )}
    </>
  )
}

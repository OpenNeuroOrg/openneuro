import React from 'react'
import './forms.scss'

export interface TextareaProps {
  placeholder: string
  disabled: boolean
  label?: string
  name: string
  labelStyle?: 'inline' | 'float' | 'default'
}

export const Textarea: React.FC<TextareaProps> = ({
  placeholder,
  label,
  name,
  labelStyle,
  ...props
}) => {
  return (
    <>
      {labelStyle == 'float' ? (
        <div className="float-form-style form-control">
          <textarea
            name={name}
            placeholder={placeholder}
            {...props}
            rows={5}
            cols={100}></textarea>
          {label ? <label htmlFor={name}>{label}</label> : null}
        </div>
      ) : labelStyle == 'inline' ? (
        <div className="form-control inline">
          {label ? <label htmlFor={name}>{label}</label> : null}
          <textarea
            name={name}
            placeholder={placeholder}
            {...props}
            rows={5}
            cols={100}></textarea>
        </div>
      ) : (
        <div className="form-control">
          {label ? <label htmlFor={name}>{label}</label> : null}
          <textarea
            name={name}
            placeholder={placeholder}
            {...props}
            rows={5}
            cols={100}></textarea>
        </div>
      )}
    </>
  )
}

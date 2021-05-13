import React from 'react'
import '../input/input.scss'

export interface TextareaProps {
  placeholder: string
  label?: string
  name: string
  type?: 'inline' | 'float' | 'default'
  setValue: string
}

export const Textarea: React.FC<TextareaProps> = ({
  placeholder,
  label,
  name,
  type,
  setValue,
}) => {
  return (
    <>
      {type == 'float' ? (
        <div className="float-form-style form-control">
          <textarea
            name={name}
            placeholder={placeholder}
            onChange={e => setValue(e.target.value)}
            rows={5}
            cols={100}></textarea>
          {label ? <label htmlFor={name}>{label}</label> : null}
        </div>
      ) : type == 'inline' ? (
        <div className="form-control inline">
          {label ? <label htmlFor={name}>{label}</label> : null}
          <textarea
            name={name}
            placeholder={placeholder}
            onChange={e => setValue(e.target.value)}
            rows={5}
            cols={100}></textarea>
        </div>
      ) : (
        <div className="form-control">
          {label ? <label htmlFor={name}>{label}</label> : null}
          <textarea
            name={name}
            placeholder={placeholder}
            onChange={e => setValue(e.target.value)}
            rows={5}
            cols={100}></textarea>
        </div>
      )}
    </>
  )
}

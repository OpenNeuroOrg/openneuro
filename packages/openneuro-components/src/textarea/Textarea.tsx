import React from 'react'

export interface TextareaProps {
  placeholder: string
  label?: string
  name: string
  type?: 'inline' | 'float' | 'default'
  setValue: (e: React.FormEvent<HTMLTextAreaElement>) => void
  value?: string
}

export const Textarea = ({
  placeholder,
  label,
  name,
  type,
  setValue,
  value,
}: TextareaProps) => {
  return (
    <>
      {type == 'float' ? (
        <div className="float-form-style form-control">
          <textarea
            name={name}
            placeholder={placeholder}
            onChange={e => setValue(e)}
            rows={5}
            cols={100}
            value={value}></textarea>
          {label ? <label htmlFor={name}>{label}</label> : null}
        </div>
      ) : type == 'inline' ? (
        <div className="form-control inline">
          {label ? <label htmlFor={name}>{label}</label> : null}
          <textarea
            name={name}
            placeholder={placeholder}
            onChange={e => setValue(e)}
            rows={5}
            cols={100}
            value={value}></textarea>
        </div>
      ) : (
        <div className="form-control">
          {label ? <label htmlFor={name}>{label}</label> : null}
          <textarea
            name={name}
            placeholder={placeholder}
            onChange={e => setValue(e)}
            rows={5}
            cols={100}
            value={value}></textarea>
        </div>
      )}
    </>
  )
}

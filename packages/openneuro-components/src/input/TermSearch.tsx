import React from 'react'
import { Input } from '../input/Input'
import { Button } from '../button/Button'
import './term-search.scss'

export interface TermSearchProps {
  setTermValue: (string) => void
  pushTerm: (string) => void
  allTerms: string[]
  className?: string
  type?: string
  label?: string
  placeholder?: string
  labelStyle?: string
  name?: string
  termValue: string
  primary?: boolean
  color?: string
  icon?: string
  iconSize?: string
  size?: string
}

export const TermSearch = ({
  className,
  termValue,
  setTermValue,
  pushTerm,
  allTerms,
  type,
  label,
  placeholder,
  labelStyle,
  name,
  color,
  icon,
  size,
  iconSize,
}: TermSearchProps) => {
  const termsArr = []
  const addTerms = value => {
    if (value === '' || value === undefined) {
      alert('please enter a term')
    } else {
      allTerms.push(value)
      setTermValue('')
    }
  }

  return (
    <>
      <div className={className + ' term-input'}>
        <Input
          type={type}
          label={label}
          placeholder={placeholder}
          labelStyle={labelStyle}
          name={name}
          value={termValue}
          setValue={setTermValue}
        />
        <Button
          primary={true}
          color={color}
          icon={icon}
          iconSize={iconSize}
          size={size}
          onClick={() => addTerms(termValue)}
        />
      </div>
      {allTerms.length ? (
        <div className="term-block">
          <ul className="active-search-terms">
            {allTerms.map((item, index) => (
              <li key={index}>
                <span>
                  {item}
                  <span>&times;</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  )
}

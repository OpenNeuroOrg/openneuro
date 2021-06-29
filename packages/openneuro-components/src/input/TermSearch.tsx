import React from 'react'
import { Input, InputPropsStyle } from '../input/Input'
import { Button, ButtonPropsSize } from '../button/Button'
import './term-search.scss'

export interface TermSearchProps {
  setTermValue: (string) => void
  pushTerm: React.Dispatch<React.SetStateAction<any[]>>
  allTerms: string[]
  className?: string
  type?: string
  label?: string
  placeholder?: string
  labelStyle?: InputPropsStyle
  name?: string
  termValue: string
  primary?: boolean
  color?: string
  icon?: string
  iconSize?: string
  size?: ButtonPropsSize
  removeFilterItem?(param, value): void
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
  removeFilterItem,
}: TermSearchProps) => {
  const emptyOrWhitespace = /^\s*$/
  const disabled =
    emptyOrWhitespace.test(termValue) || allTerms.includes(termValue)
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
          onKeyDown={e =>
            e.keyCode === 13 &&
            !disabled &&
            pushTerm(termValue as React.SetStateAction<any>)
          }
        />
        <Button
          primary={true}
          disabled={disabled}
          color={color}
          icon={icon}
          iconOnly={true}
          iconSize={iconSize}
          size={size}
          onClick={() => pushTerm(termValue as React.SetStateAction<any>)}
          label="Add Term"
        />
      </div>
      {allTerms.length ? (
        <div className="term-block">
          <ul className="active-search-terms">
            {allTerms.map((term, index) => (
              <li key={index}>
                <span>
                  {term}
                  <span onClick={() => removeFilterItem(name, term)}>
                    &times;
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  )
}

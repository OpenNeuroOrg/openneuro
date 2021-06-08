import React from 'react'
import { Input } from '../input/Input'
import { Button } from '../button/Button'
import './term-search.scss'

export interface TermSearchProps {
  setTermValue: (string) => void
  pushTerm: () => void
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
          onKeyDown={e => e.keyCode === 13 && pushTerm()}
        />
        <Button
          primary={true}
          disabled={termValue === ''}
          color={color}
          icon={icon}
          iconSize={iconSize}
          size={size}
          onClick={() => pushTerm()}
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

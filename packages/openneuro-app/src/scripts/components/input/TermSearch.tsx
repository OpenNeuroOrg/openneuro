import React from "react"
import { Input } from "../input/Input"
import type { InputPropsStyle } from "../input/Input"
import { Button } from "../button/Button"
export type ButtonPropsSize = "xsmall" | "small" | "medium" | "large"
import "./term-search.scss"

export interface TermSearchProps {
  setTermValue: (string) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  tipContent?: React.ReactNode
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
  tipContent,
  removeFilterItem,
}: TermSearchProps) => {
  const emptyOrWhitespace = /^\s*$/
  const disabled = emptyOrWhitespace.test(termValue) ||
    allTerms.includes(termValue)
  return (
    <>
      <div className={className + " term-input"}>
        <Input
          type={type}
          label={label}
          placeholder={placeholder}
          labelStyle={labelStyle}
          name={name}
          value={termValue}
          setValue={setTermValue}
          tipContent={tipContent}
          onKeyDown={(e) =>
            e.keyCode === 13 &&
            !disabled &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            pushTerm(termValue as React.SetStateAction<any>)}
        />
        <Button
          primary={true}
          disabled={disabled}
          color={color}
          icon={icon}
          iconOnly={true}
          iconSize={iconSize}
          size={size}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick={() => pushTerm(termValue as React.SetStateAction<any>)}
          label="Add Term"
        />
      </div>
      {allTerms.length
        ? (
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
        )
        : null}
    </>
  )
}

import React from "react"
import { TermSearch } from "../input/TermSearch"
import type { ButtonPropsSize } from "../button/Button"
import type { InputPropsStyle } from "../input/Input"

export interface FacetSearchProps {
  setTermValue: (string) => void
  pushTerm: React.Dispatch<React.SetStateAction<any[]>>
  allTerms: string[]
  className?: string
  type?: string
  placeholder?: string
  labelStyle?: InputPropsStyle
  name?: string
  termValue: string
  primary?: boolean
  color?: string
  icon?: string
  iconSize?: string
  size?: ButtonPropsSize
  helpText?: React.ReactNode
  removeFilterItem?(param, value): void
}

export const FacetSearch = ({
  className,
  termValue,
  setTermValue,
  pushTerm,
  allTerms,
  type,
  placeholder,
  labelStyle,
  name,
  color,
  icon,
  size,
  iconSize,
  helpText,
  removeFilterItem,
}: FacetSearchProps) => {
  return (
    <div className="facet-search">
      {helpText ? <div className="help-text">{helpText}</div> : null}
      <TermSearch
        className={className}
        primary={true}
        color={color}
        icon={icon}
        iconSize={iconSize}
        size={size}
        pushTerm={pushTerm}
        type={type}
        label={null}
        placeholder={placeholder}
        labelStyle={labelStyle}
        name={name}
        termValue={termValue}
        setTermValue={setTermValue}
        allTerms={allTerms}
        removeFilterItem={removeFilterItem}
      />
    </div>
  )
}

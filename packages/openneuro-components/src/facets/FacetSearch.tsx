import React from 'react'
import { AccordionTab, AccordionTabStyle } from '../accordion/AccordionTab'
import { AccordionWrap } from '../accordion/AccordionWrap'
import { TermSearch } from '../input/TermSearch'
import { ButtonPropsSize } from '../button/Button'
import { InputPropsStyle } from '../input/Input'
import './facet.scss'

export interface FacetSearchProps {
  accordionStyle: AccordionTabStyle
  startOpen: boolean
  label: string
  dropdown?: boolean
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
  startOpen,
  label,
  accordionStyle,
  dropdown,
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
    <AccordionWrap className="facet-accordion">
      <AccordionTab
        accordionStyle={accordionStyle}
        label={label}
        startOpen={startOpen}
        dropdown={dropdown}>
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
      </AccordionTab>
    </AccordionWrap>
  )
}

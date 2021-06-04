import React from 'react'
import { AccordionTab } from '../accordion/AccordionTab'
import { AccordionWrap } from '../accordion/AccordionWrap'
import { TermSearch } from '../input/TermSearch'
import './facet.scss'

export interface FacetSearchProps {
  accordionStyle: string
  startOpen: boolean
  label: string
  dropdown?: boolean
  setTermValue: (string) => void
  pushTerm: (string) => void
  allTerms: string[]
  className?: string
  type?: string
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
}: FacetSearchProps) => {
  return (
    <AccordionWrap className="facet-accordion">
      <AccordionTab
        accordionStyle={accordionStyle}
        label={label}
        startOpen={startOpen}
        dropdown={dropdown}>
        <div className="facet-search">
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
          />
        </div>
      </AccordionTab>
    </AccordionWrap>
  )
}

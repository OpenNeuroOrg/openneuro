import React, { useContext } from "react"
import type { FC } from "react"
import { SearchParamsCtx } from "../search-params-ctx"
import initialSearchParams from "../initial-search-params"
import { FacetRange } from "../../components/facets/FacetRange"
import { AccordionTab } from "../../components/accordion/AccordionTab"
import { AccordionWrap } from "../../components/accordion/AccordionWrap"

const AgeRangeInput: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const ageRange = searchParams.ageRange
  const setAgeRange = (ageRange) =>
    setSearchParams((prevState) => ({
      ...prevState,
      ageRange,
    }))

  const min = 0
  const max = 100
  const value =
    JSON.stringify(ageRange) === JSON.stringify(initialSearchParams.ageRange)
      ? [min, max]
      : ageRange

  return (
    <AccordionWrap className="facet-accordion">
      <AccordionTab
        accordionStyle="plain"
        label="Age of Participants"
        startOpen={false}
      >
        <FacetRange
          min={min}
          max={max}
          step={10}
          value={value}
          onChange={setAgeRange}
        />
      </AccordionTab>
    </AccordionWrap>
  )
}

export default AgeRangeInput

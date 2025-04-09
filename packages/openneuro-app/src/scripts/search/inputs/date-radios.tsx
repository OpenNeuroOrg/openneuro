import React, { useContext } from "react"
import type { FC } from "react"
import { SearchParamsCtx } from "../search-params-ctx"
import { FacetRadio } from "../../components/facets/FacetRadio"
import { AccordionTab } from "../../components/accordion/AccordionTab"
import { AccordionWrap } from "../../components/accordion/AccordionWrap"

const DateRadios: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const { date_available, date_selected } = searchParams
  const setDate = (date_selected) =>
    setSearchParams((prevState) => ({
      ...prevState,
      date_selected,
    }))

  return (
    <AccordionWrap className="facet-accordion">
      <AccordionTab
        startOpen={false}
        label="Publication Date"
        accordionStyle="plain"
      >
        <FacetRadio
          selected={date_selected}
          setSelected={setDate}
          radioArr={date_available}
          layout="row"
          name="Date"
          className="date-facet"
        />
      </AccordionTab>
    </AccordionWrap>
  )
}

export default DateRadios

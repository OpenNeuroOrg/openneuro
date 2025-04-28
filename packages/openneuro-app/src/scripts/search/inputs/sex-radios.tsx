import React, { useContext } from "react"
import type { FC } from "react"
import { SearchParamsCtx } from "../search-params-ctx"
import { FacetRadio } from "../../components/facets/FacetRadio"
import { AccordionTab } from "../../components/accordion/AccordionTab"
import { AccordionWrap } from "../../components/accordion/AccordionWrap"

const SexRadios: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const { sex_available, sex_selected } = searchParams
  const setSex = (sex_selected) =>
    setSearchParams((prevState) => ({
      ...prevState,
      sex_selected,
    }))

  return (
    <AccordionWrap className="facet-accordion">
      <AccordionTab startOpen={false} label="Sex" accordionStyle="plain">
        <FacetRadio
          selected={sex_selected}
          setSelected={setSex}
          radioArr={sex_available}
          layout="row"
          name="Sex"
        />
      </AccordionTab>
    </AccordionWrap>
  )
}

export default SexRadios

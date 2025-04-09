import React, { useContext } from "react"
import type { FC } from "react"
import { SearchParamsCtx } from "../search-params-ctx"
import { FacetSelect } from "../../components/facets/FacetSelect"
import { AccordionTab } from "../../components/accordion/AccordionTab"
import { AccordionWrap } from "../../components/accordion/AccordionWrap"

const SectionSelect: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const { section_available, section_selected } = searchParams
  const setSection = (section_selected) =>
    setSearchParams((prevState) => ({
      ...prevState,
      section_selected,
    }))

  return (
    <AccordionWrap className="facet-accordion">
      <AccordionTab accordionStyle="plain" label="Study Type" startOpen={false}>
        <FacetSelect
          selected={section_selected}
          setSelected={setSection}
          items={section_available}
        />
      </AccordionTab>
    </AccordionWrap>
  )
}

export default SectionSelect

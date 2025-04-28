import React, { useContext } from "react"
import type { FC } from "react"
import { SearchParamsCtx } from "../search-params-ctx"
import { FacetSelect } from "../../components/facets/FacetSelect"
import { AccordionTab } from "../../components/accordion/AccordionTab"
import { AccordionWrap } from "../../components/accordion/AccordionWrap"

const DiagnosisSelect: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const { diagnosis_available, diagnosis_selected } = searchParams
  const setDiagnosis = (diagnosis_selected) =>
    setSearchParams((prevState) => ({
      ...prevState,
      diagnosis_selected,
    }))

  return (
    <AccordionWrap className="facet-accordion">
      <AccordionTab accordionStyle="plain" label="Diagnosis" startOpen={false}>
        <FacetSelect
          selected={diagnosis_selected}
          setSelected={setDiagnosis}
          items={diagnosis_available}
        />
      </AccordionTab>
    </AccordionWrap>
  )
}

export default DiagnosisSelect

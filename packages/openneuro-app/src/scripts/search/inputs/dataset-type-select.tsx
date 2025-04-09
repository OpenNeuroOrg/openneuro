import React, { useContext } from "react"
import type { FC } from "react"
import { SearchParamsCtx } from "../search-params-ctx"
import { FacetSelect } from "../../components/facets/FacetSelect"
import { AccordionTab } from "../../components/accordion/AccordionTab"
import { AccordionWrap } from "../../components/accordion/AccordionWrap"

const DatasetTypeSelect: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const { bidsDatasetType_selected, bidsDatasetType_available } = searchParams
  const setDatasetType = (bidsDatasetType_selected) =>
    setSearchParams((prevState) => ({
      ...prevState,
      bidsDatasetType_selected,
    }))

  return (
    <AccordionWrap className="facet-accordion">
      <AccordionTab
        accordionStyle="plain"
        label="Dataset Type"
        startOpen={false}
      >
        <FacetSelect
          selected={bidsDatasetType_selected}
          setSelected={setDatasetType}
          items={bidsDatasetType_available}
        />
      </AccordionTab>
    </AccordionWrap>
  )
}

export default DatasetTypeSelect

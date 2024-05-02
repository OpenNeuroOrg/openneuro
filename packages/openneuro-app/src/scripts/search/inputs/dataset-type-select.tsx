import React, { FC, useContext } from "react"
import { SearchParamsCtx } from "../search-params-ctx"
import { FacetSelect } from "@openneuro/components/facets"
import { AccordionTab, AccordionWrap } from "@openneuro/components/accordion"

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

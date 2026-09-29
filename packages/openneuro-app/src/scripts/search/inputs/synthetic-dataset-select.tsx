import React, { useContext } from "react"
import type { FC } from "react"
import { SearchParamsCtx } from "../search-params-ctx"
import { FacetSelect } from "../../components/facets/FacetSelect"
import { AccordionTab } from "../../components/accordion/AccordionTab"
import { AccordionWrap } from "../../components/accordion/AccordionWrap"

export interface SyntheticDatasetSelectProps {
  label?: string
}

export const SyntheticDatasetSelect: FC<SyntheticDatasetSelectProps> = ({
  label = "Synthetic Datasets",
}) => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const { syntheticDataset } = searchParams

  const setSynthetic = (value?: unknown) =>
    setSearchParams((prevState) => ({
      ...prevState,
      syntheticDataset: typeof value === "boolean"
        ? value
        : !prevState.syntheticDataset,
    }))

  return (
    <AccordionWrap className="facet-accordion">
      <AccordionTab
        accordionStyle="plain"
        label={label}
        startOpen={Boolean(syntheticDataset)}
      >
        <FacetSelect
          selected={syntheticDataset ? "Synthetic Only" : null}
          setSelected={setSynthetic}
          items={["Synthetic Only"]}
        />
      </AccordionTab>
    </AccordionWrap>
  )
}

export const SyntheticDatasetsSelect = SyntheticDatasetSelect
export default SyntheticDatasetSelect

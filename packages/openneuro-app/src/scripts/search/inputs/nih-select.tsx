import React, { useContext } from "react"
import type { FC } from "react"
import { useNavigate } from "react-router-dom"
import { SearchParamsCtx } from "../search-params-ctx"
import { flattenedModalities } from "../initial-search-params"
import type { SearchParams } from "../initial-search-params"
import { SingleSelect } from "@openneuro/components/facets"
import initialSearchParams from "../initial-search-params"

interface NIHSelectProps {
  inHeader?: boolean
  startOpen?: boolean
  label?: string
  portalStyles?: boolean
  dropdown?: boolean
}

const NIHSelect: FC<NIHSelectProps> = ({
  inHeader = false,
  startOpen = true,
  label,
  portalStyles = false,
  dropdown,
}) => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const navigate = useNavigate()

  const { modality_available, modality_selected } = searchParams
  const setModality = (
    modality_selected: string,
  ): ReturnType<typeof setSearchParams> => {
    setSearchParams(
      (prevState: SearchParams): SearchParams => ({
        ...(inHeader ? initialSearchParams : prevState),
        modality_selected,
      }),
    )
    const modality_selected_path = flattenedModalities.find((modality) => {
      return modality.label === modality_selected
    })?.portalPath
    navigate(modality_selected_path)
  }
  return (
    <>
      <SingleSelect
        className="nih-facet facet-open"
        label={label}
        selected={modality_selected}
        setSelected={setModality}
        items={["NIH"]}
      />
    </>
  )
}

export default NIHSelect

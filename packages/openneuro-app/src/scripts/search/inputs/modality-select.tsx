import React, { useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { SearchParamsCtx } from "../search-params-ctx"
import { flattenedModalities } from "../initial-search-params"
import { FacetSelect } from "@openneuro/components/facets"
import { AccordionTab, AccordionWrap } from "@openneuro/components/accordion"

interface ModalitySelectProps {
  inHeader?: boolean
  startOpen?: boolean
  label?: string
  portalStyles?: boolean
  dropdown?: boolean
}

const ModalitySelect: React.FC<ModalitySelectProps> = ({
  startOpen = true,
  label,
  portalStyles = false,
  dropdown,
}) => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const navigate = useNavigate()
  const location = useLocation()

  const setModality = (modality_selected: string) => {
    // Update the searchParams context
    setSearchParams((prevState) => ({
      ...prevState,
      modality_selected,
    }))

    // Find the portal path for the selected modality
    const modality_selected_path = flattenedModalities.find(
      (modality) => modality.label === modality_selected,
    )?.portalPath

    // Parse the current query parameters
    const currentParams = new URLSearchParams(location.search)

    // Set the new modality_selected
    currentParams.set("modality_selected", modality_selected)

    // Construct the new query string
    const newQueryString = currentParams.toString()

    // Navigate to the new path with the updated query parameters
    navigate({
      pathname: modality_selected_path,
      search: newQueryString ? `?${newQueryString}` : "",
    })
  }

  return (
    <>
      {portalStyles
        ? (
          <FacetSelect
            className="modality-facet facet-open"
            label={label}
            selected={searchParams.modality_selected}
            setSelected={setModality}
            items={searchParams.modality_available}
          />
        )
        : (
          <AccordionWrap className="modality-facet facet-accordion">
            <AccordionTab
              accordionStyle="plain"
              label={label}
              startOpen={portalStyles ? startOpen : false}
              dropdown={dropdown}
            >
              <FacetSelect
                selected={searchParams.modality_selected}
                setSelected={setModality}
                items={searchParams.modality_available}
              />
            </AccordionTab>
          </AccordionWrap>
        )}
    </>
  )
}

export default ModalitySelect

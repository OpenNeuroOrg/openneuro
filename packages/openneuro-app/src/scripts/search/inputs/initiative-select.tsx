import React, { useContext, useEffect } from "react"
import type { FC } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { SearchParamsCtx } from "../search-params-ctx"
import { AccordionTab, AccordionWrap } from "@openneuro/components/accordion"
import { SingleSelect } from "@openneuro/components/facets"

interface InitiativeSelectProps {
  label: string
}

const InitiativeSelect: FC<InitiativeSelectProps> = ({ label }) => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const navigate = useNavigate()
  const location = useLocation()

  const { brain_initiative } = searchParams

  const setBrainInitiative = (selectedValue: string): void => {
    const newSelectedFunding = selectedValue === "NIH" ? "true" : ""

    setSearchParams((prevState) => ({
      ...prevState,
      brain_initiative: newSelectedFunding,
    }))

    const params = new URLSearchParams(location.search)

    if (newSelectedFunding) {
      params.set(
        "query",
        JSON.stringify({ brain_initiative: newSelectedFunding }),
      )
    } else {
      params.delete("query")
    }
    // Check if the URL contains 'modality_selected' before navigating
    if (!location.search.includes("modality_selected")) {
      navigate(`/search/nih?${params.toString()}`, { replace: true })
    }
  }

  useEffect(() => {
    if (
      brain_initiative === "true" &&
      !location.search.includes("brain_initiative")
    ) {
      const params = new URLSearchParams(location.search)
      params.set("query", JSON.stringify({ brain_initiative: "true" }))

      // Check if the URL contains 'modality_selected' before navigating
      if (!location.search.includes("modality_selected")) {
        navigate(`/search/nih?${params.toString()}`, { replace: true })
      }
    }
  }, [brain_initiative, location.search, navigate])

  return (
    <>
      <AccordionWrap className="modality-facet facet-accordion">
        <AccordionTab
          accordionStyle="plain"
          label={label}
          startOpen={false}
          dropdown={false}
        >
          <SingleSelect
            className="nih-facet facet-open"
            selected={brain_initiative === "true" ? "NIH" : ""}
            setSelected={setBrainInitiative}
            items={["NIH"]}
            label="NIH BRAIN Initiative"
          />
        </AccordionTab>
      </AccordionWrap>
    </>
  )
}

export default InitiativeSelect

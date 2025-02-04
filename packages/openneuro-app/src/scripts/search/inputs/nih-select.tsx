import React, { useContext, useEffect } from "react"
import type { FC } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { SearchParamsCtx } from "../search-params-ctx"
import { SingleSelect } from "@openneuro/components/facets"

interface NIHSelectProps {
  label?: string
}

const NIHSelect: FC<NIHSelectProps> = ({ label }) => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const navigate = useNavigate()
  const location = useLocation()

  const { brain_initiative } = searchParams

  const setBrainInitiative = (selectedValue: string): void => {
    const newSelectedFunding = selectedValue === "NIH" ? "true" : ""

    // Update only brain_initiative in the search params context
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

    navigate(`/search/nih?${params.toString()}`, { replace: true })
  }

  useEffect(() => {
    if (
      brain_initiative === "true" &&
      !location.search.includes("brain_initiative")
    ) {
      const params = new URLSearchParams(location.search)
      params.set("query", JSON.stringify({ brain_initiative: "true" }))
      navigate(`/search/nih?${params.toString()}`, { replace: true })
    }
  }, [brain_initiative, location.search, navigate])

  return (
    <SingleSelect
      className="nih-facet facet-open"
      label={label}
      selected={brain_initiative === "true" ? "NIH" : ""}
      setSelected={setBrainInitiative}
      items={["NIH"]}
    />
  )
}

export default NIHSelect

import React, { useContext, useEffect } from "react"
import type { FC } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { SearchParamsCtx } from "../search-params-ctx"
import { SingleSelect } from "@openneuro/components/facets"
import type { SearchParams } from "../initial-search-params"

interface NIHSelectProps {
  label?: string
}

const NIHSelect: FC<NIHSelectProps> = ({ label }) => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const navigate = useNavigate()
  const location = useLocation()

  const handleSelect = (selectedValue: string) => {
    const newSelectedGrant = selectedValue === "NIH" ? "brain_initiative" : ""

    // Update the search context
    setSearchParams((prevState: SearchParams): SearchParams => ({
      ...prevState,
      selected_grant: newSelectedGrant,
    }))

    // Update the URL with the selected query parameter
    const params = new URLSearchParams(window.location.search)
    params.delete("query") // Remove old query to prevent duplication

    if (newSelectedGrant) {
      params.set("selected_grant", newSelectedGrant)
    } else {
      params.delete("selected_grant")
    }

    // Update the URL to include the selected_grant query parameter
    navigate(`/search/nih?${params.toString()}`, { replace: true })
  }

  // Set the default selection based on the search params
  useEffect(() => {
    if (
      searchParams.selected_grant === "brain_initiative" &&
      !location.search.includes("selected_grant")
    ) {
      const params = new URLSearchParams(location.search)
      params.set("selected_grant", "brain_initiative")
      navigate(`/search/nih?${params.toString()}`, { replace: true })
    }
  }, [searchParams.selected_grant, location.search, navigate])

  return (
    <SingleSelect
      className="nih-facet facet-open"
      label={label}
      selected={searchParams?.selected_grant === "brain_initiative"
        ? "NIH"
        : ""}
      setSelected={handleSelect}
      items={["NIH"]}
    />
  )
}

export default NIHSelect

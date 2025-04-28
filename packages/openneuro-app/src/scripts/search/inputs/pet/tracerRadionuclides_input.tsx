import React, { useContext } from "react"
import type { FC } from "react"
import useState from "react-usestateref"
import { removeFilterItem, SearchParamsCtx } from "../../search-params-ctx"
import { FacetSearch } from "../../../components/facets/FacetSearch"
import { Icon } from "../../../components/icon/Icon"
import { AccordionTab } from "../../../components/accordion/AccordionTab"
import { AccordionWrap } from "../../../components/accordion/AccordionWrap"

const TracerRadionuclidesInput: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const tracerRadionuclides = searchParams.tracerRadionuclides

  const [newInput, setNewInput, newInputRef] = useState("")

  const addTracerRadionuclide = () => {
    setSearchParams((prevState) => ({
      ...prevState,
      tracerRadionuclides: [...tracerRadionuclides, newInputRef.current],
    }))
    setNewInput("")
  }

  return (
    <AccordionWrap className="facet-accordion">
      <AccordionTab
        accordionStyle="plain"
        label="Radionuclide"
        className="search-facet"
        startOpen={false}
      >
        <FacetSearch
          type="text"
          placeholder="Enter Radionuclide(s) to Search"
          labelStyle="default"
          name="tracerRadionuclides"
          termValue={newInput}
          setTermValue={setNewInput}
          primary={true}
          color="#fff"
          icon="fas fa-plus"
          iconSize="20px"
          size="small"
          pushTerm={addTracerRadionuclide}
          allTerms={tracerRadionuclides}
          removeFilterItem={removeFilterItem(setSearchParams)}
          helpText={
            <span>
              Each time the{" "}
              <Icon icon="fas fa-plus" label="plus" iconOnly={true} />{" "}
              button is clicked, it will add a search filter. Multiple words in
              a filter will return results containing any or all words. For
              advanced filters use the{" "}
              <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html#simple-query-string-syntax">
                simple query string syntax
              </a>
              .
            </span>
          }
        />
        {" "}
      </AccordionTab>
    </AccordionWrap>
  )
}

export default TracerRadionuclidesInput

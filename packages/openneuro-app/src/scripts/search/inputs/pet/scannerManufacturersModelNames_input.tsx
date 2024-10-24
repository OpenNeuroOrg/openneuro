import React, { useContext } from "react"
import type { FC } from "react"
import useState from "react-usestateref"
import { removeFilterItem, SearchParamsCtx } from "../../search-params-ctx"
import { FacetSearch } from "@openneuro/components/facets"
import { Icon } from "@openneuro/components/icon"
import { AccordionTab, AccordionWrap } from "@openneuro/components/accordion"

const ScannerManufacturersModelNamesInput: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const scannerManufacturersModelNames =
    searchParams.scannerManufacturersModelNames

  const [newInput, setNewInput, newInputRef] = useState("")

  const addScannerManufacturersModelName = () => {
    setSearchParams((prevState) => ({
      ...prevState,
      scannerManufacturersModelNames: [
        ...scannerManufacturersModelNames,
        newInputRef.current,
      ],
    }))
    setNewInput("")
  }

  return (
    <AccordionWrap className="facet-accordion">
      <AccordionTab
        accordionStyle="plain"
        label="Scanner Model"
        className="search-facet"
        startOpen={false}
      >
        <FacetSearch
          type="text"
          placeholder="Enter Scanner Model(s) to Search"
          labelStyle="default"
          name="scannerManufacturersModelNames"
          termValue={newInput}
          setTermValue={setNewInput}
          primary={true}
          color="#fff"
          icon="fas fa-plus"
          iconSize="20px"
          size="small"
          pushTerm={addScannerManufacturersModelName}
          allTerms={scannerManufacturersModelNames}
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

export default ScannerManufacturersModelNamesInput

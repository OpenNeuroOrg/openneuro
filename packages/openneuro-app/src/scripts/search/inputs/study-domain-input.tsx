import React, { useContext } from "react"
import type { FC } from "react"
import useState from "react-usestateref"
import { removeFilterItem, SearchParamsCtx } from "../search-params-ctx"
import { FacetSearch } from "@openneuro/components/facets"
import { Icon } from "@openneuro/components/icon"
import { AccordionTab, AccordionWrap } from "@openneuro/components/accordion"

const StudyDomainInput: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const studyDomains = searchParams.studyDomains

  const [newStudyDomain, setNewStudyDomain, newStudyDomainRef] = useState("")

  const addStudyDomain = () => {
    setSearchParams((prevState) => ({
      ...prevState,
      studyDomains: [...studyDomains, newStudyDomainRef.current],
    }))
    setNewStudyDomain("")
  }

  return (
    <AccordionWrap className="facet-accordion">
      <AccordionTab
        accordionStyle="plain"
        label="Study Domain"
        className="search-facet"
        startOpen={false}
      >
        <FacetSearch
          type="text"
          placeholder="Enter Study Domain(s) to Search"
          labelStyle="default"
          name="studyDomains"
          termValue={newStudyDomain}
          setTermValue={setNewStudyDomain}
          primary={true}
          color="#fff"
          icon="fas fa-plus"
          iconSize="20px"
          size="small"
          pushTerm={addStudyDomain}
          allTerms={studyDomains}
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

export default StudyDomainInput

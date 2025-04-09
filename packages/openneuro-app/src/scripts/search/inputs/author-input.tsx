import React, { useContext } from "react"
import type { FC } from "react"
import useState from "react-usestateref"
import { removeFilterItem, SearchParamsCtx } from "../search-params-ctx"
import { FacetSearch } from "../../components/facets/FacetSearch"
import { AccordionTab } from "../../components/accordion/AccordionTab"
import { AccordionWrap } from "../../components/accordion/AccordionWrap"

const AuthorInput: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const authors = searchParams.authors

  const [newAuthor, setNewAuthor, newAuthorRef] = useState("")

  const addAuthor = () => {
    setSearchParams((prevState) => ({
      ...prevState,
      authors: [...authors, newAuthorRef.current],
    }))
    setNewAuthor("")
  }

  return (
    <AccordionWrap className="facet-accordion">
      <AccordionTab
        accordionStyle="plain"
        label="Authors / PI"
        className="search-facet"
        startOpen={false}
      >
        <FacetSearch
          type="text"
          placeholder="Enter Name(s) to Search"
          labelStyle="default"
          name="authors"
          termValue={newAuthor}
          setTermValue={setNewAuthor}
          primary={true}
          color="#fff"
          icon="fas fa-plus"
          iconSize="20px"
          size="small"
          pushTerm={addAuthor}
          allTerms={authors}
          removeFilterItem={removeFilterItem(setSearchParams)}
          helpText={
            <>
              Results on multiple inputs will include all datasets that have
              {" "}
              <b>ANY</b> of the entered names
            </>
          }
        />
        {" "}
      </AccordionTab>
    </AccordionWrap>
  )
}

export default AuthorInput

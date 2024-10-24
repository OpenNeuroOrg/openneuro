import React, { useContext } from "react"
import type { FC } from "react"
import useState from "react-usestateref"
import { removeFilterItem, SearchParamsCtx } from "../search-params-ctx"
import { TermSearch } from "@openneuro/components/input"
import { Icon } from "@openneuro/components/icon"

const KeywordInput: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const keywords = searchParams.keywords

  const [newKeyword, setNewKeyword, newKeywordRef] = useState("")

  const addKeyword = () => {
    setSearchParams((prevState) => ({
      ...prevState,
      keywords: [...keywords, newKeywordRef.current],
    }))
    setNewKeyword("")
  }

  return (
    <>
      <TermSearch
        className="search-keyword"
        type="text"
        label="Keywords"
        placeholder="Enter Keyword(s) to Search"
        labelStyle="default"
        name="keywords"
        termValue={newKeyword}
        setTermValue={setNewKeyword}
        primary={true}
        color="#fff"
        icon="fas fa-plus"
        iconSize="20px"
        size="small"
        pushTerm={addKeyword}
        allTerms={keywords}
        removeFilterItem={removeFilterItem(setSearchParams)}
        tipContent={
          <span>
            Each time the{" "}
            <Icon icon="fas fa-plus" label="plus" iconOnly={true} />{" "}
            button is clicked, it will add a search filter. Multiple words in a
            filter will return results containing any or all words. For advanced
            filters use the{" "}
            <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html#simple-query-string-syntax">
              simple query string syntax
            </a>
            .
          </span>
        }
      />
    </>
  )
}

export default KeywordInput

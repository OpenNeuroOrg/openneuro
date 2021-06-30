import React, { FC, useContext } from 'react'
import useState from 'react-usestateref'
import { SearchParamsCtx, removeFilterItem } from '../search-params-ctx'
import { TermSearch, Icon } from '@openneuro/components'

const KeywordInput: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const keywords = searchParams.keywords

  const [newKeyword, setNewKeyword, newKeywordRef] = useState('')

  const addKeyword = () => {
    setSearchParams(prevState => ({
      ...prevState,
      keywords: [...keywords, newKeywordRef.current],
    }))
    setNewKeyword('')
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
            Each time the <Icon icon="fas fa-plus" /> button is clicked, it will
            add a search filter. Multiple words in a filter will return results
            containing either or both words. For advanced filters use the{' '}
            <a href="" target="_blank">
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

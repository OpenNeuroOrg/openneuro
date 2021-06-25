import React, { FC, useContext } from 'react'
import useState from 'react-usestateref'
import { SearchParamsCtx, removeFilterItem } from '../search-params-ctx'
import { FacetSearch } from '@openneuro/components'

const AuthorInput: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const authors = searchParams.authors

  const [newAuthor, setNewAuthor, newAuthorRef] = useState('')

  const addAuthor = () => {
    setSearchParams(prevState => ({
      ...prevState,
      authors: [...authors, newAuthorRef.current],
    }))
    setNewAuthor('')
  }

  return (
    <FacetSearch
      accordionStyle="plain"
      label="Sr. Author / PI"
      startOpen={false}
      className="search-authors"
      type="text"
      placeholder="Enter Name to Search"
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
    />
  )
}

export default AuthorInput

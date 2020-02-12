import React, { useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'

const SearchInput = () => {
  const inputRef = useRef(null)
  const history = useHistory()

  useEffect(() => {
    inputRef.current.focus()
  })

  const onSearch = (event, searchQuery) => {
    event.preventDefault()
    history.push(`/search/${searchQuery}`)
  }

  return (
    <div className="search-group admin">
      <form
        className="form-inline"
        onSubmit={event => onSearch(event, inputRef.current.value)}>
        <div className="form-group float-label-input full-width">
          <input
            type="text"
            name="q"
            placeholder="Search Datasets"
            ref={inputRef}
          />
        </div>
        <div className="form-group full-width float-label-input">
          <button
            className="btn-blue"
            onClick={event => onSearch(event, inputRef.current.value)}>
            <i className="fa fa-search"></i>
          </button>
        </div>
      </form>
    </div>
  )
}

export default SearchInput

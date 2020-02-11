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
    <div class="search-group admin">
      <form
        class="form-inline"
        onSubmit={event => onSearch(event, inputRef.current.value)}>
        <div class="form-group float-label-input full-width">
          <input
            type="text"
            name="q"
            placeholder="Search Datasets"
            ref={inputRef}
          />
        </div>
        <div class="form-group full-width float-label-input">
          <button
            class="btn-blue"
            onClick={event => onSearch(event, inputRef.current.value)}>
            <i class="fa fa-search"></i>
          </button>
        </div>
      </form>
    </div>
  )
}

export default SearchInput

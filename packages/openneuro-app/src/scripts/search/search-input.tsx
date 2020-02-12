import React, { useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'

const SearchInput = () => {
  const inputRef = useRef(null)
  const history = useHistory()

  useEffect(() => {
    inputRef.current.focus()
  })

  const onSearch = event => {
    event.preventDefault()
    // Don't submit unless there's a value entered
    if (inputRef.current.value) {
      history.push(`/search/${inputRef.current.value}`)
    }
  }

  return (
    <div className="search-group admin">
      <form className="form-inline" onSubmit={event => onSearch(event)}>
        <div className="form-group float-label-input full-width">
          <input
            type="text"
            name="q"
            placeholder="Search Datasets"
            ref={inputRef}
          />
        </div>
        <div className="form-group full-width float-label-input">
          <button className="btn-blue" onClick={event => onSearch(event)}>
            <i className="fa fa-search"></i>
          </button>
        </div>
      </form>
    </div>
  )
}

export default SearchInput

import React from 'react'
import Input from '../forms/input.jsx'

function search() {
  return (
    <div className="search-group">
      <form method="GET" action="/search" className="form-inline">
        <Input
          placeholder="Search Datasets"
          type="text"
          className="search-field"
          name="q"
        />
        <div className="form-group float-label-input">
          <button className="btn-blue" type="submit">
            <span className="">
              <i className="fa fa-search" />
            </span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default search

import React from 'react'
import PropTypes from 'prop-types'
import Capitalized from '../../../styles/capitalized.jsx'
import { getProfile } from '../../../authentication/profile.js'

// DatasetFilter GraphQL fields
const filterFields = ['public', 'incomplete', 'shared', 'invalid']
const filterIcons = {
  public: 'fa-globe',
  incomplete: 'fa-warning',
  shared: 'fa-user',
  invalid: 'fa-exclamation-circle',
  all: 'fa-magic',
}

export const FilterField = ({ field, queryVariables, refetch }) => {
  const fieldValue =
    field in queryVariables.filterBy && queryVariables.filterBy[field]
  const filterBy = () => {
    const newQueryVariables = { ...queryVariables }
    // Clear existing sorts
    newQueryVariables.filterBy = {}
    // Apply (or toggle) based on previous sort
    newQueryVariables.filterBy[field] =
      queryVariables.filterBy[field] === true ? false : true
    refetch(newQueryVariables)
  }
  const icon = filterIcons[field]
  return (
    <button
      key={field}
      className={
        fieldValue
          ? `btn-filter name active filter-${field}`
          : `btn-filter name filter-${field}`
      }
      onClick={filterBy}>
      <Capitalized>
        <i className={`fa ${icon}`} />
        <span className="filter-text">{field}</span>
      </Capitalized>
    </button>
  )
}

FilterField.propTypes = {
  field: PropTypes.string,
  queryVariables: PropTypes.object,
  refetch: PropTypes.func,
}

const DatasetFilter = ({ queryVariables, refetch }) => {
  const profile = getProfile()
  let fields = filterFields
  if ('admin' in profile && profile.admin) {
    fields = [...filterFields, 'all']
  }
  return (
    <>
      {fields.map(field => (
        <FilterField
          field={field}
          queryVariables={queryVariables}
          refetch={refetch}
          key={field}
        />
      ))}
    </>
  )
}

DatasetFilter.propTypes = {
  queryVariables: PropTypes.object,
  refetch: PropTypes.func,
}

export default DatasetFilter

import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

// DatasetFilter GraphQL fields
const filterFields = ['public', 'incomplete', 'shared', 'invalid', 'all']

const Capitalized = styled.span`
  text-transform: capitalize;
`

const FilterField = ({ field, queryVariables, refetch }) => {
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
  return (
    <a
      key={field}
      className={fieldValue ? 'btn-filter name active' : 'btn-filter name'}
      onClick={filterBy}>
      <Capitalized>{field}</Capitalized>
    </a>
  )
}

FilterField.propTypes = {
  field: PropTypes.string,
  queryVariables: PropTypes.object,
  refetch: PropTypes.func,
}

const DatasetFilter = ({ queryVariables, refetch }) => (
  <>
    {filterFields.map(field => (
      <FilterField
        field={field}
        queryVariables={queryVariables}
        refetch={refetch}
        key={field}
      />
    ))}
  </>
)

DatasetFilter.propTypes = {
  queryVariables: PropTypes.object,
  refetch: PropTypes.func,
}

export default DatasetFilter

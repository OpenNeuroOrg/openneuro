import React from 'react'
import PropTypes from 'prop-types'
import Capitalized from '../../../styles/capitalized.jsx'
import useMedia from '../../../mobile/media-hook.jsx'

// DatasetSort GraphQL fields
const sortFields = [
  'created',
  'name',
  'uploader',
  'stars',
  'downloads',
  'subscriptions',
]

export const SortField = ({ field, queryVariables, refetch }) => {
  const isMobile = useMedia('(max-width: 700px) ')
  const fieldValue =
    field in queryVariables.orderBy && queryVariables.orderBy[field]
  let icon
  if (fieldValue) {
    if (fieldValue === 'ascending') {
      icon = <i className="fa fa-sort-asc" />
    } else {
      icon = <i className="fa fa-sort-desc" />
    }
  }
  const sortBy = () => {
    const newQueryVariables = { ...queryVariables }
    // Clear existing sorts
    newQueryVariables.orderBy = {}
    // Apply (or toggle) based on previous sort
    newQueryVariables.orderBy[field] =
      queryVariables.orderBy[field] === 'descending'
        ? 'ascending'
        : 'descending'
    refetch(newQueryVariables)
  }
  if (!isMobile) {
    return (
      <a
        key={field}
        className={fieldValue ? 'btn-sort name active' : 'btn-sort name'}
        onClick={sortBy}>
        <Capitalized>{field}</Capitalized> {icon}
      </a>
    )
  } else if (isMobile) {
    return (
      <li
        key={field}
        className={fieldValue ? 'btn-sort name active' : 'btn-sort name'}
        onClick={sortBy}>
        <Capitalized>{field}</Capitalized> {icon}
      </li>
    )
  }
}

SortField.propTypes = {
  field: PropTypes.string,
  queryVariables: PropTypes.object,
  refetch: PropTypes.func,
}

const DatasetSorter = ({ queryVariables, refetch }) => (
  <>
    {sortFields.map(field => (
      <SortField
        field={field}
        queryVariables={queryVariables}
        refetch={refetch}
        key={field}
      />
    ))}
  </>
)

DatasetSorter.propTypes = {
  queryVariables: PropTypes.object,
  refetch: PropTypes.func,
}

export default DatasetSorter

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
  return (
    <a
      key={field}
      className={fieldValue ? 'btn-sort name active' : 'btn-sort name'}
      onClick={sortBy}>
      <Capitalized>{field}</Capitalized> {icon}
    </a>
  )
}

SortField.propTypes = {
  field: PropTypes.string,
  queryVariables: PropTypes.object,
  refetch: PropTypes.func,
}

const DatasetSorter = ({ queryVariables, refetch }) => {
  const isMobile = useMedia('(max-width: 765px) ')
  const onChange = event => {
    const newQueryVariables = { ...queryVariables }
    newQueryVariables.orderBy = {}
    newQueryVariables.orderBy[event.target.value] =
      queryVariables.orderBy[event.target.value] === 'descending'
        ? 'ascending'
        : 'descending'
    refetch(newQueryVariables)
  }
  if (!isMobile) {
    return (
      <div>
        {sortFields.map(field => (
          <SortField
            field={field}
            queryVariables={queryVariables}
            refetch={refetch}
            key={field}
          />
        ))}
      </div>
    )
  } else if (isMobile) {
    return (
      <React.Fragment>
        <select name="test" className="dropdown" onChange={onChange}>
          <option selected="true" disabled="disabled">
            Sort by...
          </option>
          {sortFields.map(field => (
            <option key={field}>{field}</option>
          ))}
        </select>
      </React.Fragment>
    )
  }
}

DatasetSorter.propTypes = {
  queryVariables: PropTypes.object,
  refetch: PropTypes.func,
  isMobile: PropTypes.bool,
}

export default DatasetSorter

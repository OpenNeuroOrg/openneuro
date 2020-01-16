import React from 'react'
import PropTypes from 'prop-types'
import Capitalized from '../../../styles/capitalized.jsx'
import useMedia from '../../../mobile/media-hook.jsx'

// DatasetSort GraphQL fields
const sortFields = ['created', 'name', 'stars', 'downloads', 'subscriptions']

// Sort fields and variables for mobile dropdown
const ASC = 'ascending'
const DESC = 'descending'

const sortFieldsMobile = [
  {
    field: 'created',
    order: ASC,
  },
  {
    field: 'name',
    order: ASC,
  },
  {
    field: 'stars',
    order: ASC,
  },
  {
    field: 'downloads',
    order: ASC,
  },
  {
    field: 'subscriptions',
    order: ASC,
  },
  {
    field: 'created',
    order: DESC,
  },
  {
    field: 'name',
    order: DESC,
  },
  {
    field: 'stars',
    order: DESC,
  },
  {
    field: 'downloads',
    order: DESC,
  },
  {
    field: 'subscriptions',
    order: DESC,
  },
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
    // Clear existing sorts
    newQueryVariables.orderBy = {}
    // grab sort order (custom data attribute) from selected option
    newQueryVariables.orderBy[event.target.value] = event.target[
      event.target.selectedIndex
    ].getAttribute('data-order')
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
        <select
          defaultValue={'DEFAULT'}
          className="mobile-dropdown"
          onChange={onChange}>
          <option value="DEFAULT" disabled>
            Sort by...
          </option>
          {sortFieldsMobile.map((sortField, i) => (
            <option
              value={sortField.field}
              data-order={sortField.order}
              key={`${i}:${sortField.field}`}>
              {`${sortField.field} (${sortField.order})`}
            </option>
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

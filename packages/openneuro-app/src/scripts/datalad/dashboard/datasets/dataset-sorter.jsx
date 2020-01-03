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
    field: 'uploader',
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
    field: 'uploader',
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
  // console.log({field})
  // console.log({queryVariables})
  // console.log({refetch})
  const fieldValue =
    field in queryVariables.orderBy && queryVariables.orderBy[field]
  console.log(field in queryVariables.orderBy && queryVariables.orderBy[field])
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
    newQueryVariables.orderBy = {} // newQueryVariables.orderBy  === {}
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
    console.log({ queryVariables })
    newQueryVariables.orderBy = {}

    newQueryVariables.orderBy[event.target.value] =
      queryVariables.orderBy[event.target.value]
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
        <select className="mobile-dropdown" onChange={onChange}>
          <option selected="true" disabled="disabled">
            Sort by...
          </option>
          {sortFieldsMobile.map(field => (
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

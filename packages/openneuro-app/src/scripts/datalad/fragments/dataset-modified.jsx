import React from 'react'
import PropTypes from 'prop-types'
import { formatDate } from '../../utils/date.js'
import parseISO from 'date-fns/parseISO'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const DatasetModified = ({ modified }) => {
  const dateAdded = formatDate(modified)
  const difference = formatDistanceToNow(parseISO(modified))
  return <h6>{`last modified on ${dateAdded} - ${difference} ago`}</h6>
}

DatasetModified.propTypes = {
  modified: PropTypes.string,
}

export default DatasetModified

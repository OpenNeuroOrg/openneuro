import React from 'react'
import PropTypes from 'prop-types'
import { formatDate } from '../../utils/date.js'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

const DatasetModified = ({ modified }) => {
  const dateAdded = formatDate(modified)
  const difference = distanceInWordsToNow(modified)
  return <h6>{`last modified on ${dateAdded} - ${difference} ago`}</h6>
}

DatasetModified.propTypes = {
  modified: PropTypes.string,
}

export default DatasetModified

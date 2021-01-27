import React from 'react'
import PropTypes from 'prop-types'
import { formatDate } from '../../utils/date.js'
import parseISO from 'date-fns/parseISO'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const DatasetUploaded = ({ uploader, created, testDifference }) => {
  const dateAdded = formatDate(created)
  const difference = testDifference || formatDistanceToNow(parseISO(created))
  return (
    <h6>
      {`uploaded by ${uploader.name} on ${dateAdded} - ${difference} ago`}
    </h6>
  )
}

DatasetUploaded.propTypes = {
  uploader: PropTypes.object,
  created: PropTypes.string,

  // Ensures deterministic snapshot test
  testDifference: PropTypes.string,
}

export default DatasetUploaded

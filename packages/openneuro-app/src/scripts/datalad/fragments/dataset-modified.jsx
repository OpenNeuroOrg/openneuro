import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const DatasetModified = ({ modified }) => {
  const dateAdded = moment(modified).format('L')
  const difference = moment(modified).fromNow(true)
  return <h6>{`last modified on ${dateAdded} - ${difference} ago`}</h6>
}

DatasetModified.propTypes = {
  modified: PropTypes.string,
}

export default DatasetModified

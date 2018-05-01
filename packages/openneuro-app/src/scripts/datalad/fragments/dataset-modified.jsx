import React from 'react'
import moment from 'moment'

const DatasetModified = ({ modified }) => {
  const dateAdded = moment(modified).format('L')
  const difference = moment(modified).fromNow(true)
  return <h6>{`last modified on ${dateAdded} - ${difference} ago`}</h6>
}

export default DatasetModified

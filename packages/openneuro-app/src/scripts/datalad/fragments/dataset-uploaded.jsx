import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const DatasetUploaded = ({ uploader, created }) => {
  const dateAdded = moment(created).format('L')
  const difference = moment(created).fromNow(true)
  return (
    <h6>
      {`uploaded by ${uploader.firstName} ${
        uploader.lastName
      } on ${dateAdded} - ${difference} ago`}
    </h6>
  )
}

DatasetUploaded.propTypes = {
  uploader: PropTypes.string,
  created: PropTypes.string,
}

export default DatasetUploaded

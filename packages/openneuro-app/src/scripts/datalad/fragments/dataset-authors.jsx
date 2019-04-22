import React from 'react'
import PropTypes from 'prop-types'

const DatasetAuthors = ({ authors = [] }) => {
  if (Array.isArray(authors)) {
    return <h6>{`authored by ${authors.join(', ')}`}</h6>
  } else {
    return null
  }
}

DatasetAuthors.propTypes = {
  authors: PropTypes.array,
}

export default DatasetAuthors

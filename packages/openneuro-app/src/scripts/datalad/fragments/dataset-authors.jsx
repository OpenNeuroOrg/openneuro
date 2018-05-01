import React from 'react'
import PropTypes from 'prop-types'

const DatasetAuthors = ({ authors }) => (
  <h6>{`authored by ${authors.join(', ')}`}</h6>
)

DatasetAuthors.propTypes = {
  authors: PropTypes.array,
}

export default DatasetAuthors

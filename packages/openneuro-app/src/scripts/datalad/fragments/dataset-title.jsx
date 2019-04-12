import React from 'react'
import PropTypes from 'prop-types'

const DatasetTitle = ({ title }) => <h1>{title}</h1>

DatasetTitle.propTypes = {
  title: PropTypes.string,
}

export default DatasetTitle

import React from 'react'
import PropTypes from 'prop-types'

const DatasetTitle = ({ title }) => <h2>{title}</h2>

DatasetTitle.propTypes = {
  title: PropTypes.string,
}

export default DatasetTitle

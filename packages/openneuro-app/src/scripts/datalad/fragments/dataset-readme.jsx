import React from 'react'
import PropTypes from 'prop-types'

/**
 * README file contents
 */
const DatasetReadme = ({ content }) => {
  return (
    <div>
      <h2>README</h2>
      <pre>{content}</pre>
    </div>
  )
}

DatasetReadme.propTypes = {
  content: PropTypes.string,
}

export default DatasetReadme

import React from 'react'
import PropTypes from 'prop-types'
import Markdown from 'react-markdown'

/**
 * README file contents
 */
const DatasetReadme = ({ content }) => {
  return (
    <div className="cte-display">
      <div className="fade-in">
        <Markdown>{content}</Markdown>
      </div>
    </div>
  )
}

DatasetReadme.propTypes = {
  content: PropTypes.string,
}

export default DatasetReadme

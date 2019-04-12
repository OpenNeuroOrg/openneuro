import React from 'react'
import PropTypes from 'prop-types'
import markdown from '../../utils/markdown'

/**
 * README file contents
 */
const DatasetReadme = ({ content }) => {
  return (
    <div className="cte-display">
      <div
        className="fade-in"
        dangerouslySetInnerHTML={markdown.format(content)}
      />
    </div>
  )
}

DatasetReadme.propTypes = {
  content: PropTypes.string,
}

export default DatasetReadme

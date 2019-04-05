import React from 'react'
import PropTypes from 'prop-types'
import markdown from '../../utils/markdown'

/**
 * README file contents
 */
const DatasetReadme = ({ content }) => {
  return (
    <div>
      <h2>README</h2>
      <div className="cte-display">
        <div
          className="fade-in"
          dangerouslySetInnerHTML={markdown.format(content)}
        />
      </div>
    </div>
  )
}

DatasetReadme.propTypes = {
  content: PropTypes.string,
}

export default DatasetReadme

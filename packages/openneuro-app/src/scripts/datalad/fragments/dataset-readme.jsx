import React from 'react'
import PropTypes from 'prop-types'
import Markdown from 'react-markdown'
import Collapsible from '../../mobile/collapsible-wrapper.jsx'
import useMedia from '../../mobile/media-hook.jsx'

/**
 * README file contents
 */

const DatasetReadme = ({ content }) => {
  const isMobile = useMedia('(max-width: 700px) ')
  if (isMobile && content) {
    return (
      <div className="cte-display">
        <div className="fade-in">
          <Collapsible title={['SHOW MORE', 'SHOW LESS']}>
            <Markdown>{content}</Markdown>
          </Collapsible>
        </div>
      </div>
    )
  } else {
    return (
      <div className="cte-display">
        <div className="fade-in">
          <Markdown>{content}</Markdown>
        </div>
      </div>
    )
  }
}

DatasetReadme.propTypes = {
  content: PropTypes.string,
}

export default DatasetReadme

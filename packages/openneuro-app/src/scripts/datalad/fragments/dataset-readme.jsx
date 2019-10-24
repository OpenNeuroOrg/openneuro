import React from 'react'
import PropTypes from 'prop-types'
import Markdown from 'react-markdown'
import Accordion from '../../mobile/accordion-wrapper.jsx'
import useMedia from '../../mobile/media-hook.jsx'
import ConditionalWrapper from '../../mobile/conditional-wrapper.jsx'

/**
 * README file contents
 */

const DatasetReadme = ({ content }) => {
  const match = useMedia('(max-width: 900px) ')
  if (match) {
    return (
      <Accordion title="See more... &#8286;">
        <div className="cte-display">
          <div className="fade-in">
            <Markdown>{content}</Markdown>
          </div>
        </div>
      </Accordion>
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

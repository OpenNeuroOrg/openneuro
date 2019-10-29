import React from 'react'
import PropTypes from 'prop-types'
import Markdown from 'react-markdown'
import Accordion from '../../mobile/accordion-wrapper.jsx'
import useMedia from '../../mobile/media-hook.jsx'
import styled from '@emotion/styled'

/**
 * README file contents
 */

const DatasetReadme = ({ content }) => {
  const isMobile = useMedia('(max-width: 700px) ')
  if (isMobile) {
    return (
      <div className="cte-display">
        <div className="fade-in">
          <Accordion title={['Show More', 'Show Less']}>
            <Markdown>{content}</Markdown>
          </Accordion>
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

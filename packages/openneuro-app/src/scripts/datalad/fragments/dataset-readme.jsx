import React from 'react'
import PropTypes from 'prop-types'
import Markdown from 'react-markdown'
import Accordion from '../../styles/accordion-wrapper.jsx'
import styled from '@emotion/styled'

/**
 * README file contents
 */

// TODO content.length HOC ?
const DatasetReadme = ({ content }) => {
  return (
    <Accordion title="See more... &#8286;">
      <div className="cte-display">
        <div className="fade-in">
          <Markdown>{content}</Markdown>
        </div>
      </div>
    </Accordion>
  )
}

DatasetReadme.propTypes = {
  content: PropTypes.string,
}

export default DatasetReadme

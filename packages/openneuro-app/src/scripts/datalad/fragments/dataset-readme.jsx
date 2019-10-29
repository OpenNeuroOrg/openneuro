import React from 'react'
import PropTypes from 'prop-types'
import Markdown from 'react-markdown'
import Accordion from '../../mobile/accordion-wrapper.jsx'
import useMedia from '../../mobile/media-hook.jsx'
import styled from '@emotion/styled'

const Container = styled.div`
  height: 110px;
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

/**
 * README file contents
 */

const DatasetReadme = ({ content }) => {
  const isMobile = useMedia('(max-width: 700px) ')
  if (isMobile) {
    return (
      <Container>
        <div className="cte-display">
          <div className="fade-in">
            <Markdown>{content}</Markdown>
            <button>Button</button>
            <Accordion>
              <Markdown>{content}</Markdown>
            </Accordion>
          </div>
        </div>
      </Container>
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

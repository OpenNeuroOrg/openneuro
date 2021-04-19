import React from 'react'
import PropTypes from 'prop-types'
import Markdown from 'markdown-to-jsx'
import Collapsible from '../../mobile/collapsible-wrapper'
import { Media } from '../../styles/media'

/**
 * README file contents
 */

const DatasetReadme = ({ content }) => {
  if (content) {
    return (
      <>
        <Media at="small">
          <div className="cte-display">
            <div className="fade-in">
              <Collapsible title={['SHOW MORE', 'SHOW LESS']}>
                <Markdown>{content || ''}</Markdown>
              </Collapsible>
            </div>
          </div>
        </Media>
        <Media greaterThanOrEqual="medium">
          <div className="cte-display">
            <div className="fade-in">
              <Markdown>{content || ''}</Markdown>
            </div>
          </div>
        </Media>
      </>
    )
  } else {
    return null
  }
}

DatasetReadme.propTypes = {
  content: PropTypes.string,
}

export default DatasetReadme

/*eslint react/no-danger: 0 */

import React from 'react'
import PropTypes from 'prop-types'
import markdown from '../../../utils/markdown'

const JobDescription = ({ jobDefinition }) => {
  let descriptions = jobDefinition.descriptions

  let shortDescription
  if (descriptions && descriptions.shortDescription) {
    shortDescription = (
      <div>
        <h5>Short Description</h5>
        <div
          className="well"
          dangerouslySetInnerHTML={markdown.format(
            descriptions.shortDescription,
          )}
        />
      </div>
    )
  }

  let tags
  if (descriptions && descriptions.tags) {
    tags = (
      <div>
        <h5>Tags</h5>
        <div className="well">{descriptions.tags}</div>
      </div>
    )
  }

  let description
  if (descriptions && descriptions.description) {
    // descriptions.description = typeof descriptions.description === 'string' ? JSON.parse(descriptions.description) : descriptions.description;

    description = (
      <div>
        <h5>Description</h5>
        <div
          className="well"
          dangerouslySetInnerHTML={markdown.format(descriptions.description)}
        />
      </div>
    )
  }

  let acknowledgments
  if (descriptions && descriptions.acknowledgments) {
    acknowledgments = (
      <div>
        <h5>Acknowledgements</h5>
        <div
          className="well"
          dangerouslySetInnerHTML={markdown.format(
            descriptions.acknowledgments,
          )}
        />
      </div>
    )
  }

  let support
  if (descriptions && descriptions.support) {
    support = (
      <div>
        <h5>Support</h5>
        <div
          className="well"
          dangerouslySetInnerHTML={markdown.format(descriptions.support)}
        />
      </div>
    )
  }
  if (shortDescription || description || acknowledgments || support || tags) {
    return (
      <div>
        <br />
        <hr />
        {shortDescription}
        {description}
        {acknowledgments}
        {support}
        {tags}
      </div>
    )
  } else {
    return null
  }
}

JobDescription.propTypes = {
  jobDefinition: PropTypes.object,
}

JobDescription.defaultProps = {
  jobDefinition: {},
}

export default JobDescription

import React from 'react'
import PropTypes from 'prop-types'

const DatasetDescription = ({ description }) => (
  <>
    <div className="description-item">
      <h2>Authors</h2>
      <span>
        {description.Authors &&
          description.Authors.map((author, index) => (
            <div className="row" key={index}>
              {author}
            </div>
          ))}
      </span>
    </div>
    <div className="description-item">
      <h2>Dataset DOI</h2>
      <span>{description.DatasetDOI}</span>
    </div>
    <div className="description-item">
      <h2>License</h2>
      <span>{description.License}</span>
    </div>
    <div className="description-item">
      <h2>Acknowledgements</h2>
      <span>{description.Acknowledgements}</span>
    </div>
    <div className="description-item">
      <h2>How to Acknowledge</h2>
      <span>{description.HowToAcknowledge}</span>
    </div>
    <div className="description-item">
      <h2>Funding</h2>
      <span>{description.Funding}</span>
    </div>
    <div className="description-item">
      <h2>References and Links</h2>
      {description.ReferencesAndLinks &&
        description.ReferencesAndLinks.map(link => (
          <div className="row" key={link}>
            {link}
          </div>
        ))}
    </div>
  </>
)

DatasetDescription.propTypes = {
  dataset: PropTypes.object,
}

export default DatasetDescription

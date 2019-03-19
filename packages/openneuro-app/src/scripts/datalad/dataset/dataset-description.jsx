import React from 'react'
import PropTypes from 'prop-types'
import EditDescriptionField from '../fragments/edit-description-field.jsx'
import EditDescriptionList from '../fragments/edit-description-list.jsx'

const DatasetDescription = ({ datasetId, description }) => (
  <>
    <div className="description-item">
      <h2>Authors</h2>
      <EditDescriptionList
        datasetId={datasetId}
        description={description}
        field="Authors">
        <span>
          {description.Authors &&
            description.Authors.map((author, index) => (
              <div className="row" key={index}>
                {author}
              </div>
            ))}
        </span>
      </EditDescriptionList>
    </div>
    <div className="description-item">
      <h2>Dataset DOI</h2>
      <EditDescriptionField
        datasetId={datasetId}
        field="DatasetDOI"
        description={description}>
        <span>{description.DatasetDOI}</span>
      </EditDescriptionField>
    </div>
    <div className="description-item">
      <h2>License</h2>
      <EditDescriptionField
        datasetId={datasetId}
        field="License"
        description={description}>
        <span>{description.License}</span>
      </EditDescriptionField>
    </div>
    <div className="description-item">
      <h2>Acknowledgements</h2>
      <EditDescriptionField
        datasetId={datasetId}
        field="Acknowledgements"
        description={description}>
        <span>{description.Acknowledgements}</span>
      </EditDescriptionField>
    </div>
    <div className="description-item">
      <h2>How to Acknowledge</h2>
      <EditDescriptionField
        datasetId={datasetId}
        field="HowToAcknowledge"
        description={description}>
        <span>{description.HowToAcknowledge}</span>
      </EditDescriptionField>
    </div>
    <div className="description-item">
      <h2>Funding</h2>
      <EditDescriptionList
        datasetId={datasetId}
        description={description}
        field="Funding">
        <span>{description.Funding}</span>
      </EditDescriptionList>
    </div>
    <div className="description-item">
      <h2>References and Links</h2>
      <EditDescriptionList
        datasetId={datasetId}
        description={description}
        field="Funding">
        {description.ReferencesAndLinks &&
          description.ReferencesAndLinks.map(link => (
            <div className="row" key={link}>
              {link}
            </div>
          ))}
      </EditDescriptionList>
    </div>
  </>
)

DatasetDescription.propTypes = {
  dataset: PropTypes.object,
}

export default DatasetDescription

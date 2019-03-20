import React from 'react'
import PropTypes from 'prop-types'
import EditDescriptionField from '../fragments/edit-description-field.jsx'
import EditDescriptionList from '../fragments/edit-description-list.jsx'

const DatasetDescription = ({ datasetId, description, editable = true }) => (
  <>
    <div className="description-item">
      <h2>Authors</h2>
      <EditDescriptionList
        datasetId={datasetId}
        description={description}
        field="Authors"
        editable={editable}>
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
      <span>{description.DatasetDOI}</span>
    </div>
    <div className="description-item">
      <h2>License</h2>
      <EditDescriptionField
        datasetId={datasetId}
        field="License"
        description={description}
        editable={editable}>
        <span>{description.License}</span>
      </EditDescriptionField>
    </div>
    <div className="description-item">
      <h2>Acknowledgements</h2>
      <EditDescriptionField
        datasetId={datasetId}
        field="Acknowledgements"
        description={description}
        editable={editable}>
        <span>{description.Acknowledgements}</span>
      </EditDescriptionField>
    </div>
    <div className="description-item">
      <h2>How to Acknowledge</h2>
      <EditDescriptionField
        datasetId={datasetId}
        field="HowToAcknowledge"
        description={description}
        editable={editable}>
        <span>{description.HowToAcknowledge}</span>
      </EditDescriptionField>
    </div>
    <div className="description-item">
      <h2>Funding</h2>
      <EditDescriptionList
        datasetId={datasetId}
        description={description}
        field="Funding"
        editable={editable}>
        <span>{description.Funding}</span>
      </EditDescriptionList>
    </div>
    <div className="description-item">
      <h2>References and Links</h2>
      <EditDescriptionList
        datasetId={datasetId}
        description={description}
        field="ReferencesAndLinks"
        editable={editable}>
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

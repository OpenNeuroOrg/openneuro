import React from 'react'
import PropTypes from 'prop-types'
import Markdown from 'react-markdown'
import EditDescriptionField from '../fragments/edit-description-field.jsx'
import EditDescriptionList from '../fragments/edit-description-list.jsx'

const arrayToMarkdown = arr => {
  return arr ? arr.map(element => ` * ${element}\n`).join('') : ''
}

const DatasetDescription = ({
  datasetId,
  description,
  isMobile,
  editMode = false,
}) => (
  <>
    <div className="description-item">
      <h2>Authors</h2>
      <EditDescriptionList
        datasetId={datasetId}
        description={description}
        field="Authors"
        editMode={editMode}
        isMobile={isMobile}>
        <div className="cte-display fade-in">
          <Markdown>{arrayToMarkdown(description.Authors)}</Markdown>
        </div>
      </EditDescriptionList>
    </div>
    <div className="description-item">
      <h2>Dataset DOI</h2>
      <span>
        {description.DatasetDOI ||
          'Create a new snapshot to obtain a DOI for the snapshot.'}
      </span>
    </div>
    <div className="description-item">
      <h2>License</h2>
      <div className="cte-display fade-in">
        <Markdown>{description.License}</Markdown>
      </div>
    </div>
    <div className="description-item">
      <h2>Acknowledgements</h2>
      <EditDescriptionField
        datasetId={datasetId}
        field="Acknowledgements"
        description={description}
        editMode={editMode}
        isMobile={isMobile}>
        <div className="cte-display fade-in">
          <Markdown>{description.Acknowledgements}</Markdown>
        </div>
      </EditDescriptionField>
    </div>
    <div className="description-item">
      <h2>How to Acknowledge</h2>
      <EditDescriptionField
        datasetId={datasetId}
        field="HowToAcknowledge"
        description={description}
        editMode={editMode}
        isMobile={isMobile}>
        <div className="cte-display fade-in">
          <Markdown>{description.HowToAcknowledge}</Markdown>
        </div>
      </EditDescriptionField>
    </div>
    <div className="description-item">
      <h2>Funding</h2>
      <EditDescriptionList
        datasetId={datasetId}
        description={description}
        field="Funding"
        editMode={editMode}
        isMobile={isMobile}>
        <div className="cte-display fade-in">
          <Markdown>{arrayToMarkdown(description.Funding)}</Markdown>
        </div>
      </EditDescriptionList>
    </div>
    <div className="description-item">
      <h2>References and Links</h2>
      <EditDescriptionList
        datasetId={datasetId}
        description={description}
        field="ReferencesAndLinks"
        editMode={editMode}
        isMobile={isMobile}>
        <div className="cte-display fade-in">
          <Markdown>{arrayToMarkdown(description.ReferencesAndLinks)}</Markdown>
        </div>
      </EditDescriptionList>
    </div>
  </>
)

DatasetDescription.propTypes = {
  datasetId: PropTypes.string,
  description: PropTypes.object,
  editMode: PropTypes.bool,
  isMobile: PropTypes.bool,
}

export default DatasetDescription

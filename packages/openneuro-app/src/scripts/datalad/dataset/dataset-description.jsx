import React from 'react'
import PropTypes from 'prop-types'
import markdown from '../../utils/markdown'
import EditDescriptionField from '../fragments/edit-description-field.jsx'
import EditDescriptionList from '../fragments/edit-description-list.jsx'

const arrayToMarkdown = arr => {
  return arr ? arr.map(element => ` * ${element}\n`).join('') : ''
}

const DatasetDescription = ({ datasetId, description, editMode = true }) => (
  <>
    <div className="description-item">
      <h2>Authors</h2>
      <EditDescriptionList
        datasetId={datasetId}
        description={description}
        field="Authors"
        editMode={editMode}>
        <div
          className="cte-display fade-in"
          dangerouslySetInnerHTML={markdown.format(
            arrayToMarkdown(description.Authors),
          )}
        />
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
      <EditDescriptionField
        datasetId={datasetId}
        field="License"
        description={description}
        editMode={editMode}>
        <div
          className="cte-display fade-in"
          dangerouslySetInnerHTML={markdown.format(description.License || '')}
        />
      </EditDescriptionField>
    </div>
    <div className="description-item">
      <h2>Acknowledgements</h2>
      <EditDescriptionField
        datasetId={datasetId}
        field="Acknowledgements"
        description={description}
        editMode={editMode}>
        <div
          className="cte-display fade-in"
          dangerouslySetInnerHTML={markdown.format(
            description.Acknowledgements || '',
          )}
        />
      </EditDescriptionField>
    </div>
    <div className="description-item">
      <h2>How to Acknowledge</h2>
      <EditDescriptionField
        datasetId={datasetId}
        field="HowToAcknowledge"
        description={description}
        editMode={editMode}>
        <div
          className="cte-display fade-in"
          dangerouslySetInnerHTML={markdown.format(
            description.HowToAcknowledge || '',
          )}
        />
      </EditDescriptionField>
    </div>
    <div className="description-item">
      <h2>Funding</h2>
      <EditDescriptionList
        datasetId={datasetId}
        description={description}
        field="Funding"
        editMode={editMode}>
        <div
          className="cte-display fade-in"
          dangerouslySetInnerHTML={markdown.format(
            arrayToMarkdown(description.Funding),
          )}
        />
      </EditDescriptionList>
    </div>
    <div className="description-item">
      <h2>References and Links</h2>
      <EditDescriptionList
        datasetId={datasetId}
        description={description}
        field="ReferencesAndLinks"
        editMode={editMode}>
        <div
          className="cte-display fade-in"
          dangerouslySetInnerHTML={markdown.format(
            arrayToMarkdown(description.ReferencesAndLinks),
          )}
        />
      </EditDescriptionList>
    </div>
  </>
)

DatasetDescription.propTypes = {
  dataset: PropTypes.object,
}

export default DatasetDescription

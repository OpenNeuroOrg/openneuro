import React from 'react'
import PropTypes from 'prop-types'
import DatasetTitle from '../fragments/dataset-title.jsx'
import DatasetUploaded from '../fragments/dataset-uploaded.jsx'
import DatasetModified from '../fragments/dataset-modified.jsx'
import DatasetAuthors from '../fragments/dataset-authors.jsx'
import DatasetSummary from '../fragments/dataset-summary.jsx'
import DatasetAnalytics from '../fragments/dataset-analytics.jsx'
import DatasetFiles from '../fragments/dataset-files.jsx'
import DatasetReadme from '../fragments/dataset-readme.jsx'

/**
 * Data routing for the main dataset query to display/edit components
 */
const DatasetContent = ({ dataset }) => (
  <span>
    <div className="col-xs-6">
      <DatasetTitle title={dataset.draft.description.Name} />
      <DatasetUploaded uploader={dataset.uploader} created={dataset.created} />
      <DatasetModified modified={dataset.draft.modified} />
      <DatasetAuthors authors={dataset.draft.description.Authors} />
      <DatasetAnalytics downloads={dataset.downloads} views={dataset.views} />
      <DatasetSummary summary={dataset.draft.summary} />
      <DatasetReadme content={dataset.draft.readme} />
    </div>
    <div className="col-xs-6">
      <DatasetFiles files={dataset.draft.files} />
    </div>
  </span>
)

DatasetContent.propTypes = {
  dataset: PropTypes.object,
}

export default DatasetContent

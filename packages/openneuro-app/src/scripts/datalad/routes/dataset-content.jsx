import React from 'react'
import DatasetUploaded from '../fragments/dataset-uploaded.jsx'
import DatasetModified from '../fragments/dataset-modified.jsx'
import DatasetAuthors from '../fragments/dataset-authors.jsx'
import DatasetSummary from '../fragments/dataset-summary.jsx'
import DatasetFiles from '../fragments/dataset-files.jsx'

const DatasetContent = ({ dataset }) => (
  <span>
    <div className="col-xs-6">
      <DatasetUploaded uploader={dataset.uploader} created={dataset.created} />
      <DatasetModified modified={dataset.modified} />
      <DatasetAuthors authors={['J. Doe', 'J. Doe']} />
      <DatasetSummary summary={dataset.draft.summary} />
    </div>
    <div className="col-xs-6">
      <DatasetFiles files={dataset.draft.files} />
    </div>
  </span>
)

export default DatasetContent

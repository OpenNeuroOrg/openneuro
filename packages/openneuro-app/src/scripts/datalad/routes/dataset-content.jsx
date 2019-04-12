import React from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import EditDescriptionField from '../fragments/edit-description-field.jsx'
import DatasetTitle from '../fragments/dataset-title.jsx'
import DatasetUploaded from '../fragments/dataset-uploaded.jsx'
import DatasetModified from '../fragments/dataset-modified.jsx'
import DatasetAuthors from '../fragments/dataset-authors.jsx'
import DatasetSummary from '../fragments/dataset-summary.jsx'
import DatasetAnalytics from '../fragments/dataset-analytics.jsx'
import DatasetFiles from '../fragments/dataset-files.jsx'
import DatasetReadme from '../fragments/dataset-readme.jsx'
import DatasetDescription from '../dataset/dataset-description.jsx'
import Validation from '../validation/validation.jsx'
import EditReadme from '../fragments/edit-readme.jsx'
import LoggedIn from '../../authentication/logged-in.jsx'
import LoggedOut from '../../authentication/logged-out.jsx'
import { getProfile } from '../../authentication/profile.js'

export const HasBeenPublished = ({ isPublic, datasetId }) =>
  isPublic ? (
    <div className="alert alert-success">
      <strong>This dataset has been published!</strong> Create a new snapshot to
      make changes available
    </div>
  ) : (
    <div className="alert alert-warning">
      <strong>This dataset has not been published!</strong>{' '}
      <Link to={`/datasets/${datasetId}/publish`}>Publish this dataset</Link> to
      make all snapshots available publicly
    </div>
  )

HasBeenPublished.propTypes = {
  isPublic: PropTypes.bool,
  datasetId: PropTypes.string,
}

// Return true if the active user has write permission
export const hasEditPermissions = (permissions, userId) => {
  if (userId) {
    const permission = permissions.find(perm => perm.user.id === userId)
    return (
      (permission &&
        (permission.level === 'admin' || permission.level === 'rw')) ||
      false
    )
  }
  return false
}

/**
 * Data routing for the main dataset query to display/edit components
 */
const DatasetContent = ({ dataset }) => {
  const user = getProfile()
  const hasEdit =
    (user && user.admin) ||
    hasEditPermissions(dataset.permissions, user && user.sub)
  return (
    <>
      <LoggedIn>
        <div className="col-xs-12">
          <HasBeenPublished isPublic={dataset.public} datasetId={dataset.id} />
        </div>
        <div className="col-xs-6">
          <EditDescriptionField
            datasetId={dataset.id}
            field="Name"
            description={dataset.draft.description}
            editMode={hasEdit}>
            <DatasetTitle title={dataset.draft.description.Name} />
          </EditDescriptionField>
          <DatasetUploaded
            uploader={dataset.uploader}
            created={dataset.created}
          />
          <DatasetModified modified={dataset.draft.modified} />
          <DatasetAuthors authors={dataset.draft.description.Authors} />
          <DatasetAnalytics
            downloads={dataset.analytics.downloads}
            views={dataset.analytics.views}
          />
          <DatasetSummary summary={dataset.draft.summary} />
          <h2>README</h2>
          <EditReadme datasetId={dataset.id} content={dataset.draft.readme}>
            <DatasetReadme content={dataset.draft.readme} />
          </EditReadme>
          <DatasetDescription
            datasetId={dataset.id}
            description={dataset.draft.description}
            editMode={hasEdit}
          />
        </div>
        <div className="col-xs-6">
          <Validation datasetId={dataset.id} />
          <DatasetFiles
            datasetId={dataset.id}
            datasetName={dataset.draft.description.Name}
            files={dataset.draft.files}
            editMode={hasEdit}
          />
        </div>
      </LoggedIn>
      <LoggedOut>
        <Redirect
          to={`/datasets/${dataset.id}/versions/${dataset.snapshots[0].tag}`}
        />
      </LoggedOut>
    </>
  )
}

DatasetContent.propTypes = {
  dataset: PropTypes.object,
}

export default DatasetContent

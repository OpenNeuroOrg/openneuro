import React from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import EditDescriptionField from '../fragments/edit-description-field.jsx'
import Helmet from 'react-helmet'
import { pageTitle } from '../../resources/strings'
import DatasetTitle from '../fragments/dataset-title.jsx'
import DatasetUploaded from '../fragments/dataset-uploaded.jsx'
import DatasetModified from '../fragments/dataset-modified.jsx'
import DatasetAuthors from '../fragments/dataset-authors.jsx'
import DatasetSummary from '../fragments/dataset-summary.jsx'
import DatasetAnalytics from '../fragments/dataset-analytics.jsx'
import DatasetProminentLinks from '../fragments/dataset-prominent-links.jsx'
import DatasetFiles from '../fragments/dataset-files.jsx'
import DatasetGitHash from '../fragments/dataset-git-hash.jsx'
import DatasetReadme from '../fragments/dataset-readme.jsx'
import DatasetDescription from '../dataset/dataset-description.jsx'
import Validation from '../validation/validation.jsx'
import EditReadme from '../fragments/edit-readme.jsx'
import IncompleteDataset from '../fragments/incomplete-dataset.jsx'
import LoggedIn from '../../authentication/logged-in.jsx'
import ErrorBoundary from '../../errors/errorBoundary.jsx'
import { getProfile, hasEditPermissions } from '../../authentication/profile.js'
import useMedia from '../../mobile/media-hook.jsx'
import useDraftSubscription from '../subscriptions/useDraftSubscription.js'
import { withApollo } from 'react-apollo'
import styled from '@emotion/styled'

const MarginBottomDiv = styled.div`
  margin-bottom: 0.5em;
`

export const HasBeenPublished = ({ isPublic, datasetId }) =>
  isPublic ? (
    <MarginBottomDiv className="alert alert-success">
      <strong>This dataset has been published!</strong> Create a new snapshot to
      make changes available
    </MarginBottomDiv>
  ) : (
    <MarginBottomDiv className="alert alert-warning">
      <strong>This dataset has not been published!</strong>{' '}
      <Link to={`/datasets/${datasetId}/publish`}>Publish this dataset</Link> to
      make all snapshots available publicly
    </MarginBottomDiv>
  )

HasBeenPublished.propTypes = {
  isPublic: PropTypes.bool,
  datasetId: PropTypes.string,
}

/**
 * Data routing for the main dataset query to display/edit components
 */
const DatasetContent = ({ dataset }) => {
  const isMobile = useMedia('(max-width: 765px) ')
  const user = getProfile()
  const hasEdit =
    (user && user.admin) ||
    hasEditPermissions(dataset.permissions, user && user.sub)
  const mobileClass = isMobile ? 'mobile-class' : 'col-xs-6'
  useDraftSubscription(dataset.id)
  return (
    <>
      <LoggedIn>
        <Helmet>
          <title>
            {dataset.draft.description.Name} - Dataset - {pageTitle}
          </title>
          <meta name="description" content={dataset.draft.readme} />
        </Helmet>
        <div className="col-xs-12">
          <HasBeenPublished isPublic={dataset.public} datasetId={dataset.id} />
        </div>
        <div className={mobileClass}>
          <EditDescriptionField
            datasetId={dataset.id}
            field="Name"
            description={dataset.draft.description}
            editMode={hasEdit}
            isMobile={isMobile}>
            <DatasetTitle title={dataset.draft.description.Name} />
          </EditDescriptionField>
          <DatasetUploaded
            uploader={dataset.uploader}
            created={dataset.created}
          />
          <DatasetModified modified={dataset.draft.modified} />
          {dataset.draft.id && (
            <DatasetAuthors authors={dataset.draft.description.Authors} />
          )}
          <DatasetAnalytics
            downloads={dataset.analytics.downloads}
            views={dataset.analytics.views}
          />
          {!isMobile && <DatasetProminentLinks dataset={dataset} />}
          {isMobile && (
            <Validation
              datasetId={dataset.id}
              issues={dataset.draft.issues}
              isMobile={isMobile}
            />
          )}
          <DatasetSummary
            datasetId={dataset.id}
            summary={dataset.draft.summary}
          />
          <h2>README</h2>
          <ErrorBoundary subject={'error in dataset readme component'}>
            <EditReadme
              datasetId={dataset.id}
              content={dataset.draft.readme}
              hasEdit={hasEdit}
              isMobile={isMobile}>
              <DatasetReadme content={dataset.draft.readme} />
            </EditReadme>
          </ErrorBoundary>
          <DatasetDescription
            datasetId={dataset.id}
            description={dataset.draft.description}
            editMode={hasEdit}
            isMobile={isMobile}
          />
        </div>
        <div className={mobileClass}>
          {!isMobile &&
            (dataset.draft.files.length === 0 ? (
              <IncompleteDataset datasetId={dataset.id} />
            ) : (
              <Validation
                datasetId={dataset.id}
                issues={dataset.draft.issues}
              />
            ))}
          <DatasetFiles
            datasetId={dataset.id}
            datasetName={dataset.draft.description.Name}
            files={dataset.draft.files}
            editMode={hasEdit}
          />
          <DatasetGitHash gitHash={dataset.draft.head} />
        </div>
      </LoggedIn>
      {dataset.snapshots && !hasEdit && (
        <Redirect
          to={`/datasets/${dataset.id}/versions/${dataset.snapshots.length &&
            dataset.snapshots[dataset.snapshots.length - 1].tag}`}
        />
      )}
    </>
  )
}

DatasetContent.propTypes = {
  dataset: PropTypes.object,
  client: PropTypes.object,
}

export default withApollo(DatasetContent)

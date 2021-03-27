import React from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import { useCookies } from 'react-cookie'
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
import DatasetGitAccess from '../fragments/dataset-git-access.jsx'
import DatasetReadme from '../fragments/dataset-readme.jsx'
import DatasetDescription from '../dataset/dataset-description.jsx'
import Validation from '../validation/validation.jsx'
import EditReadme from '../fragments/edit-readme.jsx'
import IncompleteDataset from '../fragments/incomplete-dataset.jsx'
import LoggedIn from '../../authentication/logged-in.jsx'
import ErrorBoundary from '../../errors/errorBoundary.jsx'
import { getProfile, hasEditPermissions } from '../../authentication/profile.js'
import styled from '@emotion/styled'
import { Media } from '../../styles/media'
import { MobileClass } from './mobile-class'

const MarginBottomDiv = styled.div`
  margin-bottom: 0.5em;
`

export const HasBeenPublished = ({ isPrivate, datasetId, hasDraftChanges }) =>
  isPrivate ? (
    <MarginBottomDiv className="alert alert-warning">
      <strong>This dataset has not been published!</strong>{' '}
      <Link to={`/datasets/${datasetId}/publish`}>Publish this dataset</Link> to
      make all snapshots available publicly.
    </MarginBottomDiv>
  ) : hasDraftChanges ? (
    <MarginBottomDiv className="alert alert-warning">
      <strong>This dataset has been published!</strong> There are currently
      unsaved changes to this Draft. Changes made here become public when you
      <Link to={`/datasets/${datasetId}/snapshot`}>
        {' create a new snapshot.'}
      </Link>
    </MarginBottomDiv>
  ) : (
    <MarginBottomDiv className="alert alert-success">
      <strong>{'This dataset has been published! '}</strong>
      You can make changes to this Draft page, then
      <Link to={`/datasets/${datasetId}/snapshot`}>
        {' create a new snapshot '}
      </Link>
      to make them public.
    </MarginBottomDiv>
  )

HasBeenPublished.propTypes = {
  isPrivate: PropTypes.bool,
  datasetId: PropTypes.string,
  hasDraftChanges: PropTypes.bool,
}

/**
 * Data routing for the main dataset query to display/edit components
 */
export const DatasetContent = ({ dataset }) => {
  const [cookies] = useCookies()
  const user = getProfile(cookies)
  const hasEdit =
    (user && user.admin) ||
    hasEditPermissions(dataset.permissions, user && user.sub)
  const hasDraftChanges =
    dataset.snapshots.length === 0 ||
    dataset.draft.head !==
      dataset.snapshots[dataset.snapshots.length - 1].hexsha
  return (
    <>
      <LoggedIn>
        <Helmet>
          <title>
            {dataset.draft.description.Name} - Dataset - {pageTitle}
          </title>
          <meta name="description" content={dataset.draft.readme} />
        </Helmet>
        <HasBeenPublished
          isPrivate={!dataset.public}
          datasetId={dataset.id}
          hasDraftChanges={hasDraftChanges}
        />
        <MobileClass>
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
          {dataset.draft.id && (
            <DatasetAuthors authors={dataset.draft.description.Authors} />
          )}
          <DatasetAnalytics
            downloads={dataset.analytics.downloads}
            views={dataset.analytics.views}
          />
          <Media greaterThanOrEqual="medium">
            <DatasetProminentLinks dataset={dataset} />
          </Media>
          <Media at="small">
            <Validation datasetId={dataset.id} issues={dataset.draft.issues} />
          </Media>
          <DatasetSummary
            datasetId={dataset.id}
            summary={dataset.draft.summary}
          />
          <h2>README</h2>
          <ErrorBoundary subject={'error in dataset readme component'}>
            <EditReadme
              datasetId={dataset.id}
              content={dataset.draft.readme}
              hasEdit={hasEdit}>
              <DatasetReadme content={dataset.draft.readme} />
            </EditReadme>
          </ErrorBoundary>
          <DatasetDescription
            datasetId={dataset.id}
            description={dataset.draft.description}
            editMode={hasEdit}
          />
        </MobileClass>
        <MobileClass>
          <Media greaterThanOrEqual="medium">
            {dataset.draft.files.length === 0 ? (
              <IncompleteDataset datasetId={dataset.id} />
            ) : (
              <Validation
                datasetId={dataset.id}
                issues={dataset.draft.issues}
              />
            )}
          </Media>
          {hasEdit && (
            <DatasetGitAccess datasetId={dataset.id} worker={dataset.worker} />
          )}
          <DatasetFiles
            datasetId={dataset.id}
            datasetName={dataset.draft.description.Name}
            files={dataset.draft.files}
            editMode={hasEdit}
          />
          <DatasetGitHash gitHash={dataset.draft.head} />
        </MobileClass>
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

export default DatasetContent

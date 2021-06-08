import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import MetadataForm from './metadata-form.jsx'
import SubmitMetadata from './submit-metadata.jsx'
import LoggedIn from '../../authentication/logged-in.jsx'
import {
  hasEditPermissions,
  getProfile,
} from '../../refactor_2021/authentication/profile.js'
import { getDatasetUrl } from '../../utils/dataset-url'

export const compileMetadata = dataset => {
  const getFromMetadata = key => dataset.metadata && dataset.metadata[key]
  const getFromSummary = key =>
    dataset.draft && dataset.draft.summary && dataset.draft.summary[key]
  const getFromDescription = key =>
    dataset.draft && dataset.draft.description && dataset.draft.description[key]
  const getSeniorAuthor = () => {
    const authors = getFromMetadata('Authors')
    return Array.isArray(authors) && authors[0]
  }
  const getAgesFromSummary = () => {
    const subjectMetadata = getFromSummary('subjectMetadata')
    return subjectMetadata && subjectMetadata.map(({ age }) => age)
  }
  return {
    // get from form
    associatedPaperDOI: getFromMetadata('associatedPaperDOI') || '',
    species: getFromMetadata('species') || '',
    studyLongitudinal: getFromMetadata('studyLongitudinal') || '',
    studyDomain: getFromMetadata('studyDomain') || '',
    trialCount: getFromMetadata('trialCount') || undefined,
    studyDesign: getFromMetadata('studyDesign') || '',
    openneuroPaperDOI: getFromMetadata('openneuroPaperDOI') || '',
    dxStatus: getFromMetadata('dxStatus') || '',
    grantFunderName: getFromMetadata('grantFunderName') || '',
    grantIdentifier: getFromMetadata('grantIdentifier') || '',
    affirmedDefaced: getFromMetadata('affirmedDefaced') || false,
    affirmedConsent: getFromMetadata('affirmedConsent') || false,

    // get from openneuro
    datasetId: dataset.id || '',
    datasetUrl: getDatasetUrl(dataset) || '',
    firstSnapshotCreatedAt:
      (Array.isArray(dataset.snapshots) &&
        dataset.snapshots.length &&
        dataset.snapshots[0].created) ||
      null,
    latestSnapshotCreatedAt:
      (Array.isArray(dataset.snapshots) &&
        dataset.snapshots.length &&
        dataset.snapshots[dataset.snapshots.length - 1].created) ||
      null,
    adminUsers: (dataset.permissions &&
      Array.isArray(dataset.permissions.userPermissions) &&
      dataset.permissions.userPermissions
        .filter(permission => permission.level === 'admin')
        .map(({ user }) => user && user.email)) || ['dataset has no admins'],

    // get from validator or description.json
    datasetName:
      getFromDescription('Name') || 'dataset unnamed in description.json',
    seniorAuthor: getSeniorAuthor() || 'authors not listed in description.json',
    dataProcessed: getFromSummary('dataProcessed') || false,
    ages: getAgesFromSummary() || [],
    modalities: getFromSummary('modalities') || [],
    tasksCompleted: getFromSummary('tasks') || [],
  }
}

const validations = [
  {
    fields: ['affirmedConsent', 'affirmedDefaced'],
    check: ([affirmedConsent, affirmedDefaced]) =>
      affirmedConsent || affirmedDefaced,
    errorMessage:
      'Uploader must affirm that structural scans are defaced or that they have consent to publish scans without defacing.',
  },
]

const runValidations = values =>
  validations
    .map(validation => {
      const relevantValues = validation.fields.map(key => values[key])
      // TODO - This doesn't seem necessary?
      // @ts-expect-error
      const isValid = validation.check(relevantValues)
      if (!isValid) return validation.errorMessage
    })
    .filter(error => error)

const hasChanged = (errorsA, errorsB) =>
  JSON.stringify(errorsA) !== JSON.stringify(errorsB)

const AddMetadata = ({ dataset, history, location }) => {
  const [cookies] = useCookies()
  const [values, setValues] = useState(compileMetadata(dataset))
  const [validationErrors, setValidationErrors] = useState([])
  const handleInputChange = (name, value) => {
    const newValues = {
      ...values,
      [name]: value,
    }
    setValues(newValues)

    const errors = runValidations(newValues)
    if (hasChanged(errors, validationErrors)) setValidationErrors(errors)
  }
  const submitPath = location.state && location.state.submitPath
  const user = getProfile(cookies)
  const hasEdit =
    (user && user.admin) ||
    hasEditPermissions(dataset.permissions, user && user.sub)

  return (
    <>
      <header className="col-xs-12">
        <h1>Add Metadata</h1>
        <hr />
      </header>
      <MetadataForm
        values={values}
        onChange={handleInputChange}
        hideDisabled={false}
        hasEdit={hasEdit}
        validationErrors={validationErrors}
      />
      <div className="col-xs-12 dataset-form-controls">
        <div className="col-xs-12 modal-actions">
          <Link to={`/datasets/${dataset.id}`}>
            <button className="btn-admin-blue">Return to Dataset</button>
          </Link>
          {hasEdit && (
            <LoggedIn>
              <SubmitMetadata
                datasetId={dataset.id}
                metadata={values}
                done={() => submitPath && history.push(submitPath)}
                disabled={Boolean(validationErrors.length)}
              />
            </LoggedIn>
          )}
        </div>
      </div>
    </>
  )
}

AddMetadata.propTypes = {
  dataset: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
}

export default withRouter(AddMetadata)

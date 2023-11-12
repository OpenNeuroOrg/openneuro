import React, { useState } from "react"
import PropTypes from "prop-types"
import { useLocation, useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie"
import MetadataForm from "../mutations/metadata-form.jsx"
import { DatasetRelations } from "../mutations/dataset-relations"
import SubmitMetadata from "../mutations/submit-metadata.jsx"
import LoggedIn from "../../authentication/logged-in.jsx"
import { getProfile, hasEditPermissions } from "../../authentication/profile"
import { DatasetPageBorder } from "./styles/dataset-page-border"
import { HeaderRow3, HeaderRow4 } from "./styles/header-row"

const validations = [
  {
    fields: ["affirmedConsent", "affirmedDefaced"],
    check: ([affirmedConsent, affirmedDefaced]) =>
      affirmedConsent || affirmedDefaced,
    errorMessage:
      "Uploader must affirm that structural scans are defaced or that they have consent to publish scans without defacing.",
  },
]

const runValidations = (values) =>
  validations
    .map((validation) => {
      const relevantValues = validation.fields.map((key) => values[key])
      // TODO - This doesn't seem necessary?
      // @ts-expect-error
      const isValid = validation.check(relevantValues)
      if (!isValid) return validation.errorMessage
    })
    .filter((error) => error)

const hasChanged = (errorsA, errorsB) =>
  JSON.stringify(errorsA) !== JSON.stringify(errorsB)

const AddMetadata = ({ dataset }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [cookies] = useCookies()
  const loadedMetadata = { ...dataset.metadata }
  delete loadedMetadata.__typename
  const [values, setValues] = useState(loadedMetadata)
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
  // @ts-ignore-next-line
  const submitPath = location.state && location.state.submitPath
  const user = getProfile(cookies)
  const hasEdit = (user && user.admin) ||
    hasEditPermissions(dataset.permissions, user && user.sub)

  return (
    <DatasetPageBorder className="metadata-form">
      <HeaderRow3>{hasEdit && "Add "}Metadata</HeaderRow3>
      <MetadataForm
        values={values}
        onChange={handleInputChange}
        hideDisabled={false}
        hasEdit={hasEdit}
        validationErrors={validationErrors}
      />
      <div className="dataset-form-controls ">
        {hasEdit && (
          <LoggedIn>
            <SubmitMetadata
              datasetId={dataset.id}
              metadata={values}
              done={() => submitPath && navigate(submitPath)} //TODO this isn't working
              disabled={Boolean(validationErrors.length)}
            />
          </LoggedIn>
        )}
      </div>
      <hr />
      {hasEdit && (
        <>
          <HeaderRow4>Relations</HeaderRow4>
          <DatasetRelations datasetId={dataset.id} hasEdit={hasEdit} />
        </>
      )}
    </DatasetPageBorder>
  )
}

AddMetadata.propTypes = {
  dataset: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
}

export default AddMetadata

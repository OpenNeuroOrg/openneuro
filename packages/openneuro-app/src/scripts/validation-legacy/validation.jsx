import React from "react"
import PropTypes from "prop-types"
import ValidationStatus from "./validation-status.jsx"
import ErrorBoundary from "../errors/errorBoundary.jsx"

const Validation = ({ issuesStatus, datasetId, version }) => (
  <>
    <ErrorBoundary subject={"error in dataset validation component"}>
      <ValidationStatus
        issuesStatus={issuesStatus}
        datasetId={datasetId}
        version={version}
      />
    </ErrorBoundary>
  </>
)

Validation.propTypes = {
  datasetId: PropTypes.string,
  issues: PropTypes.array,
}

export default Validation

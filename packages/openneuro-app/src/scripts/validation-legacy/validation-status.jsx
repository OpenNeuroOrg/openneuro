import React from "react"
import PropTypes from "prop-types"
import pluralize from "pluralize"
import ValidationPanel from "./validation-panel.jsx"
import Results from "./validation-results"

/**
 * These can't be React components due to legacy react-bootstrap
 * validHeader, warningHeader, errorHeader
 */

const validHeader = () => (
  <div className="super-valid">
    <h3 className="metaheader">BIDS Validation</h3>
    <span className="dataset-status ds-success">
      <i className="fa fa-check-circle" /> Valid
    </span>
  </div>
)

const warningHeader = (count) => (
  <div>
    <h3 className="metaheader">BIDS Validation</h3>

    <span className="label text-warning pull-right">
      {count} {pluralize("Warning", count)}
    </span>
    <span className="dataset-status ds-success">
      <i className="fa fa-check-circle" /> Valid
    </span>
  </div>
)

const errorHeader = (count) => (
  <div>
    <h3 className="metaheader">BIDS Validation</h3>

    <span className="label text-warning pull-right">
      {count} {pluralize("Error", count)}
    </span>
    <span className="dataset-status ds-danger">
      <i className="fa fa-exclamation-circle" /> Invalid
    </span>
  </div>
)

const Valid = () => (
  <div className="validation-wrap on-accordion-wrapper">
    <span className="undefined accordion status">
      <div className="accordion-title valid">{validHeader()}</div>
    </span>
  </div>
)

const Warnings = ({ datasetId, version, issuesStatus }) => (
  <ValidationPanel heading={warningHeader(issuesStatus.warnings)}>
    <div>
      <span className="message error fade-in">
        We found{" "}
        <strong>
          {issuesStatus.warnings + " " +
            pluralize("Warning", issuesStatus.warnings)}
        </strong>{" "}
        in your dataset. You are not required to fix warnings, but doing so will
        make your dataset more BIDS compliant.
      </span>
    </div>
    <br />
    <Results datasetId={datasetId} version={version} />
  </ValidationPanel>
)

Warnings.propTypes = {
  issuesStatus: PropTypes.object,
  datasetId: PropTypes.string,
  version: PropTypes.string,
}

const Errors = ({ datasetId, version, issuesStatus }) => (
  <ValidationPanel heading={errorHeader(issuesStatus.errors)}>
    <span className="message error fade-in">
      Your dataset is no longer valid. You must fix the{" "}
      <strong>
        {issuesStatus.errors + " " + pluralize("Error", issuesStatus.errors)}
      </strong>{" "}
      to use all of the site features.
    </span>
    <br />
    <Results datasetId={datasetId} version={version} />
  </ValidationPanel>
)

Errors.propTypes = {
  issuesStatus: PropTypes.object,
  datasetId: PropTypes.string,
  version: PropTypes.string,
}

const ValidationStatus = ({ issuesStatus, datasetId, version }) => {
  if (issuesStatus) {
    if (issuesStatus.errors > 0) {
      return (
        <Errors
          issuesStatus={issuesStatus}
          datasetId={datasetId}
          version={version}
        />
      )
    } else if (issuesStatus.warnings > 0) {
      return (
        <Warnings
          issuesStatus={issuesStatus}
          datasetId={datasetId}
          version={version}
        />
      )
    } else {
      return <Valid />
    }
  } else {
    return (
      <ValidationPanel
        heading={
          <div>
            <span className="dataset-status ds-warning ds-validation-pending">
              <i className="fa fa-circle-o-notch fa-spin" />
              Validation Pending
            </span>
          </div>
        }
      >
        <br />
        <p className="ds-validation-pending-message">
          The BIDS validator is running. This may take several minutes.
        </p>
      </ValidationPanel>
    )
  }
}

ValidationStatus.propTypes = {
  issues: PropTypes.array,
}

export default ValidationStatus

import React from "react"
import pluralize from "pluralize"
import { ValidationPanel } from "./validation-panel"
import Results from "./validation-results"

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

const errorHeader = (errorCount) => (
  <div>
    <h3 className="metaheader">BIDS Validation</h3>

    <span className="label text-warning pull-right">
      {errorCount} {pluralize("Error", errorCount)}
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

interface WarningsProps {
  datasetId: string
  version: string
  warnings: number
}

const Warnings = ({ datasetId, version, warnings }: WarningsProps) => (
  <ValidationPanel heading={warningHeader(warnings.size)}>
    <div>
      <span className="message error fade-in">
        We found{" "}
        <strong>
          {warnings + " " + pluralize("warning", warnings)}
        </strong>{" "}
        in your dataset. You are not required to fix warnings, but doing so will
        make your dataset more BIDS compliant.
      </span>
    </div>
    <br />
    <Results datasetId={datasetId} version={version} />
  </ValidationPanel>
)

interface ErrorsProps {
  datasetId: string
  version: string
  errors: number
  warnings: number
}

const Errors = ({ datasetId, version, errors }: ErrorsProps) => (
  <ValidationPanel heading={errorHeader(errors)}>
    <span className="message error fade-in">
      Your dataset is no longer valid. You must fix the{" "}
      <strong>{errors + " " + pluralize("error", errors)}</strong>{" "}
      to use all of the site features.
    </span>
    <br />
    <Results datasetId={datasetId} version={version} />
  </ValidationPanel>
)

interface ValidationProps {
  datasetId: string
  version?: string
  errors: number
  warnings: number
}

export const Validation = (
  { datasetId, version, errors, warnings }: ValidationProps,
) => {
  if (errors > 0) {
    return (
      <Errors
        datasetId={datasetId}
        version={version}
        errors={errors}
        warnings={warnings}
      />
    )
  } else if (warnings > 0) {
    return (
      <Warnings datasetId={datasetId} version={version} warnings={warnings} />
    )
  } else {
    return <Valid />
  }
}

/**
 * Display validation as pending
 */
export function ValidationPending() {
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

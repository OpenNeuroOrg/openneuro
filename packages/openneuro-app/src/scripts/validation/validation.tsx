import React from "react"
import pluralize from "pluralize"
import { ValidationPanel } from "./validation-panel"
import Results from "./validation-results"
import type { DatasetIssues } from "@bids/validator/issues"

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
  issues: DatasetIssues
  warnings: DatasetIssues
}

const Warnings = ({ issues, warnings }: WarningsProps) => (
  <ValidationPanel heading={warningHeader(warnings.size)}>
    <div>
      <span className="message error fade-in">
        We found{" "}
        <strong>
          {warnings.size + " " + pluralize("Warning", warnings.size)}
        </strong>{" "}
        in your dataset. You are not required to fix warnings, but doing so will
        make your dataset more BIDS compliant.
      </span>
    </div>
    <br />
    <Results issues={issues} />
  </ValidationPanel>
)

interface ErrorsProps {
  issues: DatasetIssues
  errors: DatasetIssues
  warnings: DatasetIssues
}

const Errors = ({ issues, errors }: ErrorsProps) => (
  <ValidationPanel heading={errorHeader(errors.size)}>
    <span className="message error fade-in">
      Your dataset is no longer valid. You must fix the{" "}
      <strong>{errors.size + " " + pluralize("Error", errors.size)}</strong>
      {" "}
      to use all of the site features.
    </span>
    <br />
    <Results issues={issues} />
  </ValidationPanel>
)

interface ValidationProps {
  issues: DatasetIssues
}

export const Validation = ({ issues }: ValidationProps) => {
  if (issues) {
    const grouped = issues.groupBy("severity")
    const warnings = grouped.get("warning")
    const errors = grouped.get("error")
    if (errors?.size) {
      return <Errors issues={issues} errors={errors} warnings={warnings} />
    } else if (warnings?.size) {
      return <Warnings issues={issues} warnings={warnings} />
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

import React from 'react'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'
import { Subscription } from 'react-apollo'
import ValidationPanel from './validation-panel.jsx'
import Results from '../../validation/validation-results.jsx'

/**
 * These can't be React components due to legacy react-bootstrap
 * validHeader, warningHeader, errorHeader
 */

const validHeader = () => (
  <div className="super-valid">
    <span className="dataset-status ds-success">
      <i className="fa fa-check-circle" /> Valid
    </span>
  </div>
)

const warningHeader = count => (
  <div>
    <span className="dataset-status ds-success">
      <i className="fa fa-check-circle" /> Valid
    </span>
    <span className="label text-warning pull-right">
      {count} {pluralize('Warning', count)}
    </span>
  </div>
)

const errorHeader = count => (
  <div>
    <span className="dataset-status ds-danger">
      <i className="fa fa-exclamation-circle" /> Invalid
    </span>
    <span className="label text-warning pull-right">
      {count} {pluralize('Error', count)}
    </span>
  </div>
)

const Valid = () => (
  <ValidationPanel heading={validHeader()}>
    <br />
  </ValidationPanel>
)

const Warnings = ({ errors, warnings }) => (
  <ValidationPanel heading={warningHeader(warnings.length)}>
    <div>
      <span className="message error fade-in">
        We found{' '}
        <strong>
          {warnings.length + ' ' + pluralize('Warning', warnings.length)}
        </strong>{' '}
        in your dataset. You are not required to fix warnings, but doing so will
        make your dataset more BIDS compliant.
      </span>
    </div>
    <br />
    <Results errors={errors} warnings={warnings} />
  </ValidationPanel>
)

Warnings.propTypes = {
  errors: PropTypes.array,
  warnings: PropTypes.array,
}

const Errors = ({ errors, warnings }) => (
  <ValidationPanel heading={errorHeader(errors.length)}>
    <span className="message error fade-in">
      Your dataset is no longer valid. You must fix the{' '}
      <strong>{errors.length + ' ' + pluralize('Error', errors.length)}</strong>{' '}
      to use all of the site features.
    </span>
    <br />
    <Results errors={errors} warnings={warnings} />
  </ValidationPanel>
)

Errors.propTypes = {
  errors: PropTypes.array,
  warnings: PropTypes.array,
}

const ValidationStatus = ({ issues }) => {
  if (issues) {
    const warnings = issues.filter(issue => issue.severity === 'warning')
    const errors = issues.filter(issue => issue.severity === 'error')
    if (errors.length) {
      return <Errors errors={errors} warnings={warnings} />
    } else if (warnings.length) {
      return <Warnings errors={errors} warnings={warnings} />
    } else {
      return <Valid />
    }
  } else {
    return (
      <ValidationPanel
        heading={
          <div>
            <span className="dataset-status ds-warning">
              <i className="fa fa-circle-o-notch fa-spin" />
              Validation Pending
            </span>
          </div>
        }>
        <br />
        <p>The BIDS validator is running. This may take several minutes.</p>
      </ValidationPanel>
    )
  }
}

ValidationStatus.propTypes = {
  issues: PropTypes.array,
}

export default ValidationStatus

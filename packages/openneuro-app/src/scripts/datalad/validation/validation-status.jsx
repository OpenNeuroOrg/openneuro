import React from 'react'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'
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

class ValidationStatus extends React.Component {
  constructor(props) {
    super(props)
    let issues = this.props.issues
    this.state = this._getWarningsAndErrors(issues)
  }

  _getWarningsAndErrors(issues) {
    return {
      warnings: issues.filter(issue => issue.severity === 'warning'),
      errors: issues.filter(issue => issue.severity === 'error'),
    }
  }

  render() {
    const warnings = this.state.warnings
    const errors = this.state.errors
    if (errors.length) {
      return <Errors errors={errors} warnings={warnings} />
    } else if (warnings.length) {
      return <Warnings errors={errors} warnings={warnings} />
    } else {
      return <Valid />
    }
  }
}

ValidationStatus.propTypes = {
  issues: PropTypes.array,
}

export default ValidationStatus

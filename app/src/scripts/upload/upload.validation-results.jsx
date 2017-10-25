// dependencies -----------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'
import { Accordion, Panel } from 'react-bootstrap'
import Issues from './upload.validation-results.issues.jsx'

// component setup --------------------------------------------------------

export default class ValidationResults extends React.Component {
  // life cycle events ------------------------------------------------------

  render() {
    let errors = this.props.errors
    let warnings = this.props.warnings

    if (errors === 'Invalid') {
      return false
    }

    // errors
    let errorsWrap
    if (errors.length > 0) {
      let fileCount = this._countFiles(errors)
      let errorHeader = (
        <span>
          view {errors.length} {pluralize('error', errors.length)} in{' '}
          {fileCount} {pluralize('files', fileCount)}
        </span>
      )
      errorsWrap = (
        <Panel
          className="fade-in upload-panel error-wrap"
          header={errorHeader}
          eventKey="1">
          <Issues issues={errors} issueType="Error" />
        </Panel>
      )
    }

    //warnings
    let warningWrap
    if (warnings && warnings.length > 0) {
      let fileCount = this._countFiles(warnings)
      let warningHeader = (
        <span>
          view {warnings.length} {pluralize('warning', warnings.length)} in{' '}
          {fileCount} {pluralize('files', fileCount)}
        </span>
      )
      warningWrap = (
        <Panel
          className="fade-in upload-panel warning-wrap"
          header={warningHeader}
          eventKey="2">
          <Issues issues={warnings} issueType="Warning" />
        </Panel>
      )
    }

    // validations errors and warning wraps
    return (
      <Accordion className="validation-messages" accordion>
        {errorsWrap}
        {warningWrap}
      </Accordion>
    )
  }

  // custom methods ---------------------------------------------------------

  _countFiles(issues) {
    let numFiles = 0
    for (let issue of issues) {
      numFiles += issue.files.length
      if (issue.additionalFileCount) {
        numFiles += issue.additionalFileCount
      }
    }
    return numFiles
  }
}

ValidationResults.Props = {
  errors: [],
  warnings: [],
}

ValidationResults.propTypes = {
  errors: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  warnings: PropTypes.array,
}

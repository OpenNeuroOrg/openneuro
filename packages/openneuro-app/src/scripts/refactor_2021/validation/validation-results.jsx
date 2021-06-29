// dependencies -----------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'
import { AccordionTab, AccordionWrap } from '@openneuro/components'

import Issues from './validation-results.issues.jsx'

// component setup --------------------------------------------------------

class ValidationResults extends React.Component {
  // life cycle events ------------------------------------------------------

  render() {
    const errors = this.props.errors
    const warnings = this.props.warnings

    if (errors === 'Invalid') {
      return false
    }

    // errors
    let errorsWrap
    if (errors.length > 0) {
      const fileCount = this._countFiles(errors)
      const errorHeader = (
        <span>
          view {errors.length} {pluralize('error', errors.length)} in{' '}
          {fileCount} {pluralize('files', fileCount)}
        </span>
      )
      errorsWrap = (
        <AccordionTab
          className="fade-in upload-panel error-wrap"
          label={errorHeader}
          accordionStyle="plain"
          //eventKey="1"
        >
          <Issues issues={errors} issueType="Error" />
        </AccordionTab>
      )
    }

    //warnings
    let warningWrap
    if (warnings && warnings.length > 0) {
      const fileCount = this._countFiles(warnings)
      const warningHeader = (
        <span>
          view {warnings.length} {pluralize('warning', warnings.length)} in{' '}
          {fileCount} {pluralize('files', fileCount)}
        </span>
      )
      warningWrap = (
        <AccordionTab
          className="fade-in upload-panel warning-wrap"
          label={warningHeader}
          accordionStyle="plain"
          //eventKey="2"
        >
          <Issues issues={warnings} issueType="Warning" />
        </AccordionTab>
      )
    }

    // validations errors and warning wraps
    return (
      <AccordionWrap className="validation-messages">
        {errorsWrap}
        {warningWrap}
      </AccordionWrap>
    )
  }

  // custom methods ---------------------------------------------------------

  _countFiles(issues) {
    let numFiles = 0
    for (const issue of issues) {
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

export default ValidationResults

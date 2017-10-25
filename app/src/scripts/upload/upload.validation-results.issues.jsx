// dependencies -----------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { Accordion, Panel } from 'react-bootstrap'
import pluralize from 'pluralize'
import Issue from './upload.validation-results.issues.issue.jsx'

// component setup --------------------------------------------------------

class Issues extends React.Component {
  // life cycle events ------------------------------------------------------

  render() {
    let self = this
    let issueFiles = this.props.issues
    let issues = issueFiles.map((issue, index) => {
      let totalFiles = issue.files.length
      if (issue.additionalFileCount) {
        totalFiles += issue.additionalFileCount
      }
      let issueCount = pluralize('files', totalFiles)

      let header = (
        <span className="file-header">
          <h4 className="em-header clearfix">
            <strong className="em-header pull-left">
              {this.props.issueType}: {index + 1}
            </strong>
            <span className="pull-right">
              {totalFiles} {issueCount}
            </span>
          </h4>
          {issue.reason}
        </span>
      )

      // issue sub-errors
      let subErrors = issue.files.map(function(error, index2) {
        return error ? (
          <Issue
            type={self.props.issueType}
            file={issue.file}
            error={error}
            index={index2}
            key={index2}
          />
        ) : null
      })

      if (issue.additionalFileCount > 0) {
        subErrors.push(
          <div className="em-body" key="additional-file-count">
            <span className="e-meta">
              and {issue.additionalFileCount} more{' '}
              {pluralize('files', issue.additionalFileCount)}
            </span>
          </div>,
        )
      }

      // issue panel
      return (
        <Panel
          key={index}
          header={header}
          className="validation-error fade-in"
          eventKey={index}>
          {subErrors}
        </Panel>
      )
    })

    return <Accordion>{issues}</Accordion>
  }

  // custom methods ---------------------------------------------------------
}

Issues.propTypes = {
  issues: PropTypes.array.isRequired,
  issueType: PropTypes.string.isRequired,
}

export default Issues

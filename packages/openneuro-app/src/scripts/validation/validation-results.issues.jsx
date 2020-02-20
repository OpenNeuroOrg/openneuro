// dependencies -----------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { Accordion, Panel } from 'react-bootstrap'
import pluralize from 'pluralize'
import Issue from './validation-results.issues.issue.jsx'

class Issues extends React.Component {
  render() {
    const issueFiles = this.props.issues
    const issues = issueFiles.map((issue, index) => {
      let totalFiles = issue.files.length
      if (issue.additionalFileCount) {
        totalFiles += issue.additionalFileCount
      }
      const issueCount = pluralize('files', totalFiles)

      const header = (
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
      const subErrors = issue.files.map((error, index2) => {
        return error ? (
          <Issue
            type={this.props.issueType}
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
}

Issues.propTypes = {
  issues: PropTypes.array.isRequired,
  issueType: PropTypes.string.isRequired,
}

export default Issues

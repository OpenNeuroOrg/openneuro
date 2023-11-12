// dependencies -----------------------------------------------------------

import React from "react"
import PropTypes from "prop-types"
import { AccordionTab, AccordionWrap } from "@openneuro/components/accordion"

import pluralize from "pluralize"
import Issue from "./validation-results.issues.issue.jsx"

class Issues extends React.Component {
  render() {
    const issueFiles = this.props.issues
    const issues = issueFiles.map((issue, index) => {
      let totalFiles = issue.files.length || issue.files.size
      if (issue.additionalFileCount) {
        totalFiles += issue.additionalFileCount
      }
      const issueCount = pluralize("files", totalFiles)

      const header = (
        <span className="file-header">
          <h4 className="em-header">
            <strong className="em-header ">
              {this.props.issueType}: {index + 1}
            </strong>
            <span className="file-issue-count">
              {totalFiles} {issueCount}
            </span>
          </h4>
          {issue.reason}
        </span>
      )

      // issue sub-errors
      const subErrors = Array.from(issue.files).map((error, index2) => {
        // Schema validator returns multiple files here
        // map those to the old sub-issue model to display them
        if (error?.length) {
          return error.filter(Boolean).map((i, index3) => {
            return (
              <Issue
                type={this.props.issueType}
                file={i.file}
                error={i}
                index={index3}
                key={index3}
              />
            )
          })
        } else {
          return error
            ? (
              <Issue
                type={this.props.issueType}
                file={issue.file}
                error={error}
                index={index2}
                key={index2}
              />
            )
            : null
        }
      })

      if (issue.additionalFileCount > 0) {
        subErrors.push(
          <div className="em-body" key="additional-file-count">
            <span className="e-meta">
              and {issue.additionalFileCount} more{" "}
              {pluralize("files", issue.additionalFileCount)}
            </span>
          </div>,
        )
      }

      // issue panel
      return (
        <AccordionTab
          key={index}
          label={header}
          accordionStyle="plain"
          className="validation-error fade-in"
          //eventKey={index}
        >
          {subErrors}
        </AccordionTab>
      )
    })

    return <AccordionWrap>{issues}</AccordionWrap>
  }
}

Issues.propTypes = {
  issues: PropTypes.array.isRequired,
  issueType: PropTypes.string.isRequired,
}

export default Issues

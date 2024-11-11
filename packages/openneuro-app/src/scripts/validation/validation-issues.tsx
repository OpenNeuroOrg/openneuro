import React from "react"
import { AccordionTab, AccordionWrap } from "@openneuro/components/accordion"
import { DatasetIssues } from "@bids/validator/issues"
import type { Issue } from "@bids/validator/issues"

interface IssueProps {
  datasetIssues: DatasetIssues
  issue: Issue
}

/**
 * One issue entry
 */
export function Issue({ datasetIssues, issue }: IssueProps) {
  return (
    <div className="em-body">
      <div className="e-meta">
        <label>{issue.code}</label>
        <span>{issue.subCode ? ` - ${issue.subCode}` : ""}</span>
      </div>
      <div className="e-meta">
        <label>Rule:</label> {issue.rule}
      </div>
      <div className="e-meta">
        <label>Messages:</label>
        <p>{datasetIssues.codeMessages.get(issue.code)}</p>
      </div>
      {issue.suggestion
        ? (
          <div className="e-meta">
            <label>Suggestion:</label>
            <p>{issue.suggestion}</p>
          </div>
        )
        : null}
    </div>
  )
}

interface IssuesProps {
  issues: DatasetIssues
}

/**
 * DatasetIssue grouped by severity and then location
 */
export function Issues({ issues }: IssuesProps) {
  if (issues) {
    const locations = issues.groupBy("location")
    const panels = []
    for (const [location, issue] of locations.entries()) {
      const header = (
        <span className="file-header">
          <h4 className="em-header">
            <strong className="em-header ">
              {location}
            </strong>
            <span className="file-issue-count">
              {issue.size} {issues.size == 1 ? "issue" : "issues"}
            </span>
          </h4>
        </span>
      )
      panels.push(
        (
          <AccordionTab
            key={location as string}
            label={header}
            accordionStyle="plain"
            className="validation-error fade-in"
          >
            {issue.issues.map((issue) => {
              return (
                <Issue
                  datasetIssues={issues}
                  issue={issue}
                  key={issue.location + issue.code + issue.subCode}
                />
              )
            })}
          </AccordionTab>
        ),
      )
    }
    return <AccordionWrap>{panels}</AccordionWrap>
  }
  return null
}

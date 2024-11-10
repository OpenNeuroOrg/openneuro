import React from "react"
import { ValidationPanel } from "./validation-panel"
import { DatasetIssues } from "@bids/validator/issues"
import type { Issue } from "@bids/validator/issues"
import styled from "@emotion/styled"

const Ul = styled.ul`
  padding: 0;
  list-style-type: none;
`

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
        <label>Code:</label>
        {issue.code}
      </div>
      {issue.subCode
        ? (
          <div className="e-meta">
            <label>Subcode:</label>
            {issue.subCode}
          </div>
        )
        : null}
      <div className="e-meta">
        <label>Rule:</label>
        {issue.rule}
      </div>
      <div className="e-meta">
        <label>Messages:</label>
        <p>{datasetIssues.codeMessages.get(issue.code)}</p>
      </div>
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
        (<li key={location as string}>
          <ValidationPanel heading={header}>
            {issue.issues.map((issue) => {
              return (
                <Issue
                  datasetIssues={issues}
                  issue={issue}
                  key={issue.location + issue.code + issue.subCode}
                />
              )
            })}
          </ValidationPanel>
        </li>),
      )
    }
    return <Ul>{panels}</Ul>
  }
  return null
}

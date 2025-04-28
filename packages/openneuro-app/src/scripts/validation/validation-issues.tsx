import React from "react"
import { AccordionTab } from "../components/accordion/AccordionTab"
import { AccordionWrap } from "../components/accordion/AccordionWrap"
import type { DatasetIssues, Issue } from "@bids/validator/issues"

interface IssueProps {
  datasetIssues: DatasetIssues
  issue: Issue
  groupBy: "location" | "code"
}

/**
 * One issue entry
 */
export function Issue({ datasetIssues, issue, groupBy }: IssueProps) {
  return (
    <div className="em-body">
      {groupBy === "location"
        ? (
          <div className="e-meta">
            <label>{issue.code}</label>
            <span>{issue.subCode ? ` - ${issue.subCode}` : ""}</span>
          </div>
        )
        : (
          <div className="e-meta">
            <label>{issue.location}</label>
          </div>
        )}
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
  groupBy: "location" | "code"
}

/**
 * DatasetIssue grouped by severity and then location
 */
export function Issues({ issues, groupBy }: IssuesProps) {
  if (issues) {
    const groups = issues.groupBy(groupBy)
    const panels = []
    for (const [group, issue] of groups.entries()) {
      const header = (
        <span className="file-header">
          <h4 className="em-header">
            <strong className="em-header">
              {group}
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
            key={group as string}
            label={header}
            accordionStyle="plain"
            className="validation-error fade-in"
          >
            {issue.issues.map((issue, index) => {
              return (
                <Issue
                  datasetIssues={issues}
                  issue={issue}
                  key={index}
                  groupBy={groupBy}
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

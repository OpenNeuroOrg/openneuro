import React from "react"
import pluralize from "pluralize"
import { AccordionTab, AccordionWrap } from "@openneuro/components/accordion"
import type { DatasetIssues } from "@bids/validator/issues"
import { Issues } from "./validation-issues"

interface ValidationResultsProps {
  issues: DatasetIssues
}

/**
 * Display ValidationResults with collapsing panels
 */
export function ValidationResults(
  { issues }: ValidationResultsProps,
) {
  const groupedIssues = issues.groupBy("severity")
  const errors = groupedIssues.get("error")
  const warnings = groupedIssues.get("warning")

  // errors
  let errorsWrap
  if (errors?.size > 0) {
    const errorHeader = (
      <span>
        view {errors.size} {pluralize("error", errors.size)}
      </span>
    )
    errorsWrap = (
      <AccordionTab
        className="fade-in upload-panel error-wrap"
        label={errorHeader}
        accordionStyle="plain"
      >
        <Issues issues={errors} groupBy="code" />
      </AccordionTab>
    )
  }

  //warnings
  let warningWrap
  if (warnings?.size > 0) {
    const warningHeader = (
      <span>
        view {warnings.size} {pluralize("warning", warnings.size)}
      </span>
    )
    warningWrap = (
      <AccordionTab
        className="fade-in upload-panel warning-wrap"
        label={warningHeader}
        accordionStyle="plain"
      >
        <Issues issues={warnings} groupBy="code" />
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

export default ValidationResults

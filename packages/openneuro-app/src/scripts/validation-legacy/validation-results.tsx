// dependencies -----------------------------------------------------------

import React from "react"
import pluralize from "pluralize"
import { AccordionTab, AccordionWrap } from "@openneuro/components/accordion"
import Issues from "./validation-results.issues.jsx"
import { useLegacyValidationResults } from "./validation-legacy-query.js"
import { Loading } from "@openneuro/components/loading"

function countFiles(issues) {
  let numFiles = 0
  for (const issue of issues) {
    numFiles += Array.from(issue.files).length
    if (issue.additionalFileCount) {
      numFiles += issue.additionalFileCount
    }
  }
  return numFiles
}

interface ValidationResultsProp {
  datasetId: string
  version: string
}

export function ValidationResults(
  { datasetId, version }: ValidationResultsProp,
) {
  const { loading, issues, error } = useLegacyValidationResults(
    datasetId,
    version,
  )

  if (loading || error) {
    return (
      <>
        <Loading />
        <span className="message">Loading validation results...</span>
      </>
    )
  } else {
    const warnings = issues.filter((issue) => issue.severity === "warning")
    const errors = issues.filter((issue) => issue.severity === "error")

    // errors
    let errorsWrap
    if (errors.length > 0) {
      const fileCount = countFiles(errors)
      const errorHeader = (
        <span>
          view {errors.length} {pluralize("error", errors.length)} in{" "}
          {fileCount} {pluralize("files", fileCount)}
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
      const fileCount = countFiles(warnings)
      const warningHeader = (
        <span>
          view {warnings.length} {pluralize("warning", warnings.length)} in{" "}
          {fileCount} {pluralize("files", fileCount)}
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
}

export default ValidationResults

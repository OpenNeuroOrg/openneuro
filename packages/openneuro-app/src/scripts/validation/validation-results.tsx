import React from "react"
import { AccordionTab, AccordionWrap } from "@openneuro/components/accordion"
import { Issues } from "./validation-issues"
import { RadioGroup } from "@openneuro/components/radio"
import type { DatasetIssues } from "@bids/validator/issues"

interface ValidationResultsProps {
  issues: DatasetIssues
}

type ValidationGroupBy = "code" | "location"

/**
 * Display ValidationResults with collapsing panels
 */
export function ValidationResults(
  { issues }: ValidationResultsProps,
) {
  const [groupBy, setGroupBy] = React.useState<ValidationGroupBy>("code")
  const groupedIssues = issues.groupBy("severity")
  const errors = groupedIssues.get("error")
  const warnings = groupedIssues.get("warning")

  // errors
  let errorsWrap
  if (errors?.size > 0) {
    const errorHeader = (
      <span>
        view {errors.size} {errors.size === 1 ? "error" : "errors"}
      </span>
    )
    errorsWrap = (
      <AccordionTab
        className="fade-in upload-panel error-wrap"
        label={errorHeader}
        accordionStyle="plain"
      >
        <Issues issues={errors} groupBy={groupBy} />
      </AccordionTab>
    )
  }

  //warnings
  let warningWrap
  if (warnings?.size > 0) {
    const warningHeader = (
      <span>
        view {warnings.size} {warnings.size === 1 ? "warning" : "warnings"}
      </span>
    )
    warningWrap = (
      <AccordionTab
        className="fade-in upload-panel warning-wrap"
        label={warningHeader}
        accordionStyle="plain"
      >
        <Issues issues={warnings} groupBy={groupBy} />
      </AccordionTab>
    )
  }

  // validations errors and warning wraps
  return (
    <>
      <label title="show-datasets">Sort by:</label>
      <RadioGroup
        radioArr={["code", "location"]}
        layout="row"
        name="show-datasets"
        selected={groupBy}
        setSelected={setGroupBy}
      />
      <AccordionWrap className="validation-messages">
        {errorsWrap}
        {warningWrap}
      </AccordionWrap>
    </>
  )
}

export default ValidationResults

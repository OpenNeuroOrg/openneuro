import React from "react"
import { Validation } from "../../validation/validation"
import LegacyValidation from "../../validation-legacy/validation.jsx"
import { DatasetIssues } from "@bids/validator/issues"
import type { Issue } from "@bids/validator/issues"

// TODO - Generate from GraphQL
interface CodeMessageInput {
  code: string
  message: string
}

// TODO - Generate from GraphQL
interface ValidationFragment {
  issues: Issue[]
  codeMessages: CodeMessageInput[]
}

export interface ValidationBlockProps {
  datasetId: string
  issues?: object
  validation?: ValidationFragment
}

/**
 * Display validation output from both validators
 * issues - legacy validator object
 * validation - OpenNeuro schema validator GraphQL type
 */
export const ValidationBlock: React.FC<ValidationBlockProps> = ({
  datasetId,
  issues,
  validation,
}) => {
  if (issues) {
    return (
      <div className="validation-accordion">
        <LegacyValidation datasetId={datasetId} issues={issues} />
      </div>
    )
  } else {
    // Reconstruct DatasetIssues from JSON
    const datasetIssues = new DatasetIssues()
    // If data exists, populate this
    if (validation?.issues) {
      datasetIssues.issues = validation.issues
      datasetIssues.codeMessages = validation.codeMessages.reduce(
        (acc, curr) => {
          acc.set(curr.code, curr.message)
          return acc
        },
        new Map<string, string>(),
      )
    }
    return (
      <div className="validation-accordion">
        <Validation issues={datasetIssues} />
      </div>
    )
  }
}

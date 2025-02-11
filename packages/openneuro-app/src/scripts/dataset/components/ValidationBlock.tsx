import React from "react"
import { Validation, ValidationPending } from "../../validation/validation"
import LegacyValidation from "../../validation-legacy/validation.jsx"
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
  warnings: number
  errors: number
}

export interface ValidationBlockProps {
  datasetId: string
  version?: string
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
  version,
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
    // If data exists, populate this. Otherwise we show pending.
    if (validation?.warnings + validation?.errors > 0) {
      return (
        <div className="validation-accordion">
          <Validation
            datasetId={datasetId}
            version={version}
            warnings={validation.warnings}
            errors={validation.errors}
          />
        </div>
      )
    } else {
      return (
        <div className="validation-accordion">
          <ValidationPending />
        </div>
      )
    }
  }
}

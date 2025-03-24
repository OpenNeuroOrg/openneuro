import React from "react"
import * as Sentry from "@sentry/react"
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
  issuesStatus?: {
    errors: number
    warnings: number
  }
  validation?: ValidationFragment
  stopPolling: () => void
}

/**
 * Display validation output from both validators
 * issues - legacy validator object
 * validation - OpenNeuro schema validator GraphQL type
 */
export const ValidationBlock: React.FC<ValidationBlockProps> = ({
  datasetId,
  version,
  issuesStatus,
  validation,
  stopPolling,
}) => {
  if (issuesStatus || validation) {
    if (typeof stopPolling === "function") {
      try {
        stopPolling()
      } catch (error) {
        Sentry.captureException(error)
      }
    }
    return (
      <div className="validation-accordion">
        {issuesStatus
          ? (
            <LegacyValidation
              datasetId={datasetId}
              version={version}
              issuesStatus={issuesStatus}
            />
          )
          : validation && (
            <Validation
              datasetId={datasetId}
              version={version}
              warnings={validation.warnings}
              errors={validation.errors}
            />
          )}
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

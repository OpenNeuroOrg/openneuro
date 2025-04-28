import React, { useContext } from "react"
import * as Sentry from "@sentry/react"
import { Validation, ValidationPending } from "../../validation/validation"
import LegacyValidation from "../../validation-legacy/validation.jsx"
import type { Issue } from "@bids/validator/issues"
import DatasetQueryContext from "../../datalad/dataset/dataset-query-context.js"

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
}) => {
  const { stopPolling, startPolling } = useContext(DatasetQueryContext)

  // Function to stop polling if issuesStatus or validation exists
  const stopPollingValidation = () => {
    if (issuesStatus || validation) {
      if (typeof stopPolling === "function") {
        try {
          stopPolling()
        } catch (error) {
          Sentry.captureException(error)
        }
      }
    }
  }

  // Function to start polling if ValidationPending is shown.
  const startPollingValidation = () => {
    if (!issuesStatus && !validation) {
      if (typeof startPolling === "function") {
        try {
          startPolling(10000) // 10s poll interval
        } catch (error) {
          Sentry.captureException(error)
        }
      }
    }
  }

  // Stop polling on render if validation or issuesStatus exists.
  React.useEffect(() => {
    stopPollingValidation()
    startPollingValidation()
  }, [issuesStatus, validation, stopPolling, startPolling])

  if (issuesStatus) {
    return (
      <div className="validation-accordion">
        <LegacyValidation
          datasetId={datasetId}
          version={version}
          issuesStatus={issuesStatus}
        />
      </div>
    )
  } else {
    if (validation) {
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

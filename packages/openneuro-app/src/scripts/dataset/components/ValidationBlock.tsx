import React, { useContext } from "react"
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
  const { stopPolling } = useContext(DatasetQueryContext)

  console.log("ValidationBlock stopPolling:", typeof stopPolling) // Debug 3

  // Function to stop polling if issuesStatus or validation exists
  const stopPollingValidation = () => {
    if (issuesStatus || validation) {
      if (typeof stopPolling === "function") {
        try {
          stopPolling()
          console.log(
            "Polling stopped - issuesStatus or validation data available.",
          )
          console.log("stopPolling called from ValidationBlock")
        } catch (error) {
          console.error("Error stopping polling:", error)
        }
      } else {
        console.error("stopPolling is not a function")
      }
    }
  }

  // Stop polling on render if validation or issuesStatus exists.
  React.useEffect(() => {
    stopPollingValidation()
  }, [issuesStatus, validation, stopPolling])

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

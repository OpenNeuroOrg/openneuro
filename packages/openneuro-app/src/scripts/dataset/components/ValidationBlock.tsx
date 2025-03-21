import React, { useEffect, useState } from "react"
import { Validation, ValidationPending } from "../../validation/validation"
import LegacyValidation from "../../validation-legacy/validation.jsx"
import type { Issue } from "@bids/validator/issues"
import { useValidationResults } from "../../validation/validation-results-query"

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

export const ValidationBlock: React.FC<ValidationBlockProps> = ({
  datasetId,
  version,
  issuesStatus,
}) => {
  const [reloadComponent, setReloadComponent] = useState(false)
  const { loading, error, issues, refetch } = useValidationResults(
    datasetId,
    version,
  ) // Correct destructuring
  const [validationData, setValidationData] = useState<
    { errors: number; warnings: number } | null
  >(null)

  useEffect(() => {
    if (issues && issues.issues) {
      const errors = issues.issues.filter((issue) =>
        issue.severity === "error"
      ).length
      const warnings = issues.issues.filter((issue) =>
        issue.severity === "warning"
      ).length
      setValidationData({ errors, warnings })
    }
  }, [issues])

  useEffect(() => {
    console.log("ValidationBlock useEffect called")
    const ws = new WebSocket(`ws://${window.location.hostname}:8111`)

    ws.onopen = () => {
      console.log("WebSocket connection opened in ValidationBlock.")
    }

    ws.onerror = (error) => {
      console.error("WebSocket Error in ValidationBlock:", error)
      ws.close()
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log("WebSocket Message Received in ValidationBlock:", data)
      if (data.datasetId === datasetId && data.version === version) {
        console.log(
          "Validation Completed (WebSocket) in ValidationBlock:",
          data,
        )
        refetch()
        ws.close()
      }
    }

    ws.onclose = () => {
      console.log("WebSocket connection closed in ValidationBlock.")
    }

    return () => {
      ws.close()
    }
  }, [datasetId, version, refetch])

  useEffect(() => {
    console.log("reloadComponent updated:", reloadComponent)
  }, [reloadComponent])

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
    // If data exists, populate this. Otherwise we show pending.
    if (validationData) {
      return (
        <div className="validation-accordion">
          <Validation
            datasetId={datasetId}
            version={version}
            warnings={validationData.warnings}
            errors={validationData.errors}
          />
        </div>
      )
    } else if (loading) {
      return (
        <div className="validation-accordion">
          <ValidationPending />
        </div>
      )
    } else if (error) {
      return (
        <div className="validation-accordion">
          <div>Error loading validation data.</div>
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

import React from "react"
import semver from "semver"
import LegacyValidation from "../validation-legacy/validation.jsx"
import type { DatasetIssues } from "@bids/validator/issues"
import { Validation } from "./validation"

interface ValidationVersionDetectProps {
  datasetId: string
  issues: DatasetIssues | object
  validatorVersion: string
}

/**
 * Return the correct validation views depending on what version of the validator was used
 */
export function ValidationVersionDetect(
  { datasetId, issues, validatorVersion }: ValidationVersionDetectProps,
) {
  if (!validatorVersion || semver.lt(validatorVersion, "1.14.14")) {
    return <LegacyValidation datasetId={datasetId} issues={issues} />
  } else {
    return <Validation issues={issues as DatasetIssues} />
  }
}

import React from "react"
import pluralize from "pluralize"
import { Loading } from "../components/loading/Loading"
import { ValidationResultsDisplay } from "../validation/validation-results"
import UploaderContext from "./uploader-context.js"
import type { ValidationResult } from "@bids/validator/main"
import { DatasetIssues } from "@bids/validator/issues"

interface UploadValidationStatusProps {
  issues: DatasetIssues
  next: () => void
  reset: () => void
}

const UploadValidatorStatus = (
  { issues, next, reset }: UploadValidationStatusProps,
) => {
  const groupedIssues = issues.groupBy("severity")
  const errorCount = groupedIssues.get("error")?.size || 0
  const warnCount = groupedIssues.get("warning")?.size || 0
  const issuesCount = errorCount + warnCount
  if (issuesCount === 0) {
    return (
      <div className="message fade-in">
        This dataset has no issues.
        <button className="fileupload-btn btn-blue" onClick={next}>
          Continue
        </button>
      </div>
    )
  } else if (errorCount === 0 && warnCount > 0) {
    return (
      <div className="message warn fade-in">
        We found {warnCount} {pluralize("warning", warnCount)}{" "}
        in your dataset. You are not required to fix warnings, but doing so will
        make your dataset more BIDS compliant. Continue or fix the issues and
        select folder again.
        <button className="fileupload-btn btn-blue" onClick={next}>
          Continue
        </button>
      </div>
    )
  } else {
    return (
      <div className="message error fade-in">
        Your dataset is not a valid BIDS dataset. Fix the{" "}
        <strong>
          {errorCount} {pluralize("error", errorCount)}
        </strong>{" "}
        and{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            reset()
          }}
        >
          select your folder again.
        </a>
        {" "}
      </div>
    )
  }
}

interface UploadValidatorProps {
  files: FileList | File[]
  next: () => void
  reset: () => void
}

interface UploadValidatorState {
  validating: boolean
  issues: DatasetIssues
  summary: object
}

class UploadValidator
  extends React.Component<UploadValidatorProps, UploadValidatorState> {
  constructor(props) {
    super(props)
    const schemaValidator = import("../workers/schema.js")
    this.state = {
      validating: true,
      issues: new DatasetIssues(),
      summary: {},
    }
    schemaValidator.then((schemaValidatorModule) => {
      schemaValidatorModule.validation(Array.from(this.props.files)).then(
        this.done,
      )
    })
  }

  /**
   * Called when validation finishes
   */
  done = ({ issues, summary }: ValidationResult) => {
    this.setState({ issues, summary, validating: false })
  }

  render() {
    if (this.state.validating) {
      return <Loading />
    } else {
      return (
        <div>
          <UploadValidatorStatus
            issues={this.state.issues}
            next={this.props.next}
            reset={this.props.reset}
          />
          <ValidationResultsDisplay
            issues={this.state.issues}
          />
          <span className="bids-link">
            Click to view details on{" "}
            <a
              href="http://bids.neuroimaging.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              BIDS specification
            </a>
          </span>
        </div>
      )
    }
  }
}

const UploadIssues = () => (
  <UploaderContext.Consumer>
    {(uploader) => (
      <UploadValidator
        files={uploader.selectedFiles as FileList}
        next={() => uploader.setLocation("/upload/metadata")}
        reset={() => uploader.setLocation("/upload")}
      />
    )}
  </UploaderContext.Consumer>
)

export default UploadIssues

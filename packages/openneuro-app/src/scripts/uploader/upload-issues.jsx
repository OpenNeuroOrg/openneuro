import React from 'react'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'
import validate from 'bids-validator'
import Spinner from '../common/partials/spinner.jsx'
import Results from '../validation/validation-results.jsx'
import UploaderContext from './uploader-context.js'

const UploadValidatorStatus = ({ issues, next, reset }) => {
  const errorCount = issues.errors.length
  const warnCount = issues.warnings.length
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
        We found {warnCount} {pluralize('warning', warnCount)} in your dataset.
        You are not required to fix warnings, but doing so will make your
        dataset more BIDS compliant. Continue or fix the issues and select
        folder again.
        <button className="fileupload-btn btn-blue" onClick={next}>
          Continue
        </button>
      </div>
    )
  } else {
    return (
      <div className="message error fade-in">
        Your dataset is not a valid BIDS dataset. Fix the{' '}
        <strong>
          {errorCount} {pluralize('error', errorCount)}
        </strong>{' '}
        and{' '}
        <a
          href="#"
          onClick={e => {
            e.preventDefault()
            reset()
          }}>
          select your folder again.
        </a>{' '}
      </div>
    )
  }
}

class UploadValidator extends React.Component {
  constructor(props) {
    super(props)
    this.done = this.done.bind(this)
    this.state = {
      validating: true,
      issues: {},
      summary: {},
    }
  }

  componentWillMount() {
    const options = {}
    validate.BIDS(this.props.files, options, this.done)
  }

  /**
   * Called when validation finishes
   */
  done(issues, summary) {
    this.setState({ issues, summary, validating: false })
  }

  render() {
    if (this.state.validating) {
      return <Spinner text="validating" active={true} />
    } else {
      return (
        <div>
          <UploadValidatorStatus
            issues={this.state.issues}
            next={this.props.next}
            reset={this.props.reset}
          />
          <Results
            errors={this.state.issues.errors}
            warnings={this.state.issues.warnings}
          />
          <span className="bids-link">
            Click to view details on{' '}
            <a
              href="http://bids.neuroimaging.io"
              target="_blank"
              rel="noopener noreferrer">
              BIDS specification
            </a>
          </span>
        </div>
      )
    }
  }
}

UploadValidator.propTypes = {
  // Files can be an FileList object or an array of File objects
  files: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  next: PropTypes.func,
  reset: PropTypes.func,
}

const UploadIssues = () => (
  <UploaderContext.Consumer>
    {uploader => (
      <UploadValidator
        files={uploader.selectedFiles}
        next={() => uploader.setLocation('/upload/disclaimer')}
        reset={() => uploader.setLocation('/upload')}
      />
    )}
  </UploaderContext.Consumer>
)

export default UploadIssues

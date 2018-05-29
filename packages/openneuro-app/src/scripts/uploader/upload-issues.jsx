import React from 'react'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'
import validate from 'bids-validator'
import Spinner from '../common/partials/spinner.jsx'
import Results from '../upload/upload.validation-results.jsx'
import UploaderContext from './uploader-context.js'

const UploadValidatorStatus = ({ issues, next }) => {
  const errorCount = issues.errors.length
  const warnCount = issues.warnings.length
  const issuesCount = errorCount + warnCount
  if (issuesCount === 0) {
    return (
      <span>
        This dataset has no issues.
        <button className="btn-blue" onClick={next}>
          Continue
        </button>
      </span>
    )
  } else {
    return <span>This dataset has errors to fix.</span>
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

const UploadIssues = () => (
  <UploaderContext.Consumer>
    {uploader => (
      <UploadValidator files={uploader.list} next={uploader.disclaimer} />
    )}
  </UploaderContext.Consumer>
)

export default UploadIssues

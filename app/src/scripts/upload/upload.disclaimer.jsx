// dependencies -------------------------------------------------------

import React from 'react'
import actions from './upload.actions.js'

export default class Disclaimer extends React.Component {
  // life cycle events --------------------------------------------------

  render() {
    return (
      <div>
        <span className="disclaimer fade-in error">
          <h4>
            By uploading this dataset to OpenNeuro I agree to the following
            conditions:
          </h4>
          <p>
            I am the owner of this dataset and have any necessary ethics
            permissions to share the data publicly. This dataset does not
            include any identifiable personal health information as defined by
            the{' '}
            <a href="https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/">
              Health Insurance Portability and Accountability Act of 1996
            </a>{' '}
            (including names, zip codes, dates of birth, acquisition dates,
            facial features on structural scans etc.).
          </p>
          <p>
            I agree that this dataset and results of all analyses performed on
            it using the OpenNeuro platform will become publicly available under
            a{' '}
            <a href="https://wiki.creativecommons.org/wiki/CC0">
              Creative Commons CC0
            </a>{' '}
            or{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/legalcode">
              Creative Commons CC-BY
            </a>{' '} license (depending on the dataset metadata) after a grace period of 18 months
            counted from first successful analysis of data from more than one
            participant. You will be able to apply for up to three 6 month extensions to increase
            the grace period in case the publication of a corresponding paper takes longer than expected.
            See <a href="/faq">FAQ</a> for details.
          </p>
        </span>
        <button className="btn-blue" onClick={actions.resumeUpload}>
          I Agree
        </button>
      </div>
    )
  }
}

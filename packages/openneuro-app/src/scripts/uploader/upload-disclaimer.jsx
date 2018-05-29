import React from 'react'
import UploaderContext from './uploader-context.js'

const UploadDisclaimer = () => (
  <UploaderContext.Consumer>
    {uploader => (
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
            </a>{' '}
            license (depending on the dataset metadata) after a grace period of
            36 months counted from first successful analysis of data from more
            than one participant. You will be able to apply for up to two 6
            month extensions to increase the grace period in case the
            publication of a corresponding paper takes longer than expected. See{' '}
            <a href="/faq">FAQ</a> for details.
          </p>
          <p>
            Please refrain from uploading datasets already publicly available in
            other repositories.
          </p>
        </span>
        <button className="btn-blue" onClick={uploader.upload}>
          I Agree
        </button>
      </div>
    )}
  </UploaderContext.Consumer>
)

export default UploadDisclaimer

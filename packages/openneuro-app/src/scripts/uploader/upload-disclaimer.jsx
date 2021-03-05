import React, { useState } from 'react'
import UploaderContext from './uploader-context.js'

const UploadDisclaimer = () => {
  const [affirmedDefaced, setAffirmedDefaced] = useState(false)
  const [affirmedConsent, setAffirmedConsent] = useState(false)
  return (
    <UploaderContext.Consumer>
      {uploader => (
        <div className="disclaimer fade-in">
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
            etc). I agree to destroy any key linking the personal identity of
            research participants to the subject codes used in the dataset.
          </p>
          <p>
            I agree that this dataset will become publicly available under a{' '}
            <a href="https://wiki.creativecommons.org/wiki/CC0">
              Creative Commons CC0
            </a>{' '}
            license after a grace period of 36 months counted from the date of
            the first snapshot creation for this dataset. You will be able to
            apply for up to two 6 month extensions to increase the grace period
            in case the publication of a corresponding paper takes longer than
            expected. See <a href="/faq">FAQ</a> for details.
          </p>
          <p>
            Please refrain from uploading datasets already publicly available in
            other repositories.
          </p>
          <p>This dataset is not subject to GDPR protections.</p>
          <p>Please affirm one of the following:</p>
          <label>
            <input
              type="checkbox"
              onChange={() => setAffirmedDefaced(!affirmedDefaced)}
              defaultChecked={affirmedDefaced}
            />
            &nbsp; All structural scans have been defaced, obscuring any tissue
            on or near the face that could potentially be used to reconstruct
            the facial structure.
          </label>
          <label>
            <input
              type="checkbox"
              onChange={() => setAffirmedConsent(!affirmedConsent)}
              defaultChecked={affirmedConsent}
            />
            &nbsp; I have explicit participant consent and ethical authorization
            to publish structural scans without defacing.
          </label>
          <span className="message">
            <button
              className="fileupload-btn btn-blue"
              onClick={() => {
                uploader.captureMetadata({
                  ...uploader.metdata,
                  affirmedDefaced,
                  affirmedConsent,
                })
                uploader.upload({ affirmedDefaced, affirmedConsent })
              }}
              disabled={!(affirmedDefaced || affirmedConsent)}>
              I Agree
            </button>
          </span>
        </div>
      )}
    </UploaderContext.Consumer>
  )
}

export default UploadDisclaimer

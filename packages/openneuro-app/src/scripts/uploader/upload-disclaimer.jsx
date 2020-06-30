import React from 'react'
import UploaderContext from './uploader-context.js'

const UploadDisclaimer = () => (
  <UploaderContext.Consumer>
    {uploader => (
      <div className="disclaimer fade-in">
        <h4>
          By uploading this dataset to OpenNeuro I agree to the following
          conditions:
        </h4>
        <p>
          I am the owner of this dataset and have any necessary ethics
          permissions to share the data publicly. This dataset does not include
          any identifiable personal health information as defined by the{' '}
          <a href="https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/">
            Health Insurance Portability and Accountability Act of 1996
          </a>{' '}
          (including names, zip codes, dates of birth, acquisition dates, facial
          features on structural scans etc.). I agree to destroy any key linking
          the personal identity of research participants to the subject codes
          used in the dataset.
        </p>
        <p>
          I agree that this dataset will become publicly available under a{' '}
          <a href="https://wiki.creativecommons.org/wiki/CC0">
            Creative Commons CC0
          </a>{' '}
          license after a grace period of 36
          months counted from the first successful snapshot of the dataset. 
          You will be able to apply for up to two 6 month
          extensions to increase the grace period in case the publication of a
          corresponding paper takes longer than expected. See{' '}
          <a href="/faq">FAQ</a> for details.
        </p>
        <p>
          Please refrain from uploading datasets already publicly available in
          other repositories.
        </p>
        <p>This dataset is not subject to GDPR protections.</p>
        <span className="message">
          <button className="fileupload-btn btn-blue" onClick={uploader.upload}>
            I Agree
          </button>
        </span>
      </div>
    )}
  </UploaderContext.Consumer>
)

export default UploadDisclaimer

import React, { useState } from "react"
import UploaderContext from "./uploader-context.js"
import { UploadDisclaimerInput } from "./upload-disclaimer-input"

/**
 * Defacing/consent input logic
 */
export const testAffirmed = (affirmedDefaced, affirmedConsent) =>
  !(
    (affirmedDefaced && !affirmedConsent) ||
    (!affirmedDefaced && affirmedConsent)
  )

const UploadDisclaimer = () => {
  const [affirmedDefaced, setAffirmedDefaced] = useState(false)
  const [affirmedConsent, setAffirmedConsent] = useState(false)
  return (
    <UploaderContext.Consumer>
      {(uploader) => (
        <div className="disclaimer fade-in">
          <UploadDisclaimerInput
            affirmedDefaced={affirmedDefaced}
            affirmedConsent={affirmedConsent}
            onChange={({ affirmedDefaced, affirmedConsent }) => {
              setAffirmedDefaced(affirmedDefaced)
              setAffirmedConsent(affirmedConsent)
            }}
          />
          <span className="message">
            <button
              className="fileupload-btn btn-blue"
              onClick={() => {
                uploader.captureMetadata({
                  ...uploader.metadata,
                  affirmedDefaced,
                  affirmedConsent,
                })
                uploader.upload({ affirmedDefaced, affirmedConsent })
              }}
              disabled={testAffirmed(affirmedDefaced, affirmedConsent)}
            >
              I Agree
            </button>
          </span>
        </div>
      )}
    </UploaderContext.Consumer>
  )
}

export default UploadDisclaimer

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
  const [syntheticDataset, setSyntheticDataset] = useState(false)
  return (
    <UploaderContext.Consumer>
      {(uploader) => (
        <div className="disclaimer fade-in">
          <UploadDisclaimerInput
            affirmedDefaced={affirmedDefaced}
            affirmedConsent={affirmedConsent}
            syntheticDataset={syntheticDataset}
            onChange={(
              { affirmedDefaced, affirmedConsent, syntheticDataset },
            ) => {
              setAffirmedDefaced(affirmedDefaced)
              setAffirmedConsent(affirmedConsent)
              setSyntheticDataset(syntheticDataset)
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
                  syntheticDataset,
                })
                uploader.upload({
                  affirmedDefaced,
                  affirmedConsent,
                  syntheticDataset,
                })
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

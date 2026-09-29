import React, { useContext, useEffect, useState } from "react"
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
  const uploader = useContext(UploaderContext)
  const [affirmedDefaced, setAffirmedDefaced] = useState(false)
  const [affirmedConsent, setAffirmedConsent] = useState(false)
  const [syntheticDataset, setSyntheticDataset] = useState(false)

  useEffect(() => {
    if (uploader?.location?.pathname === "/hidden") {
      setAffirmedDefaced(false)
      setAffirmedConsent(false)
      setSyntheticDataset(false)
    }
  }, [uploader?.location?.pathname])

  const isMetadataDisplayed =
    uploader?.location?.pathname === "/upload/metadata"
  const disabled = !isMetadataDisplayed ||
    testAffirmed(affirmedDefaced, affirmedConsent)

  return (
    <div className="disclaimer fade-in">
      <UploadDisclaimerInput
        affirmedDefaced={affirmedDefaced}
        affirmedConsent={affirmedConsent}
        syntheticDataset={syntheticDataset}
        showInputs={false}
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
            uploader?.captureMetadata?.({
              ...uploader.metadata,
              affirmedDefaced,
              affirmedConsent,
              syntheticDataset,
            })
            uploader?.upload?.({
              affirmedDefaced,
              affirmedConsent,
              syntheticDataset,
            })
          }}
          disabled={disabled}
        >
          I Agree
        </button>
      </span>
    </div>
  )
}

export default UploadDisclaimer

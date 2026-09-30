import PropTypes from "prop-types"
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

const UploadDisclaimer = ({ showInputs = false }) => {
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

  const affirmedDefacedEffective = affirmedDefaced ||
    Boolean(uploader?.metadata?.affirmedDefaced)
  const affirmedConsentEffective = affirmedConsent ||
    Boolean(uploader?.metadata?.affirmedConsent)
  const syntheticDatasetEffective = syntheticDataset ||
    Boolean(uploader?.metadata?.syntheticDataset)

  const isMetadataDisplayed =
    uploader?.location?.pathname === "/upload/metadata"
  const disabled = !isMetadataDisplayed ||
    testAffirmed(affirmedDefacedEffective, affirmedConsentEffective)

  return (
    <div className="disclaimer fade-in">
      <UploadDisclaimerInput
        affirmedDefaced={affirmedDefacedEffective}
        affirmedConsent={affirmedConsentEffective}
        syntheticDataset={syntheticDatasetEffective}
        showInputs={showInputs}
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
              affirmedDefaced: affirmedDefacedEffective,
              affirmedConsent: affirmedConsentEffective,
              syntheticDataset: syntheticDatasetEffective,
            })
            uploader?.upload?.({
              affirmedDefaced: affirmedDefacedEffective,
              affirmedConsent: affirmedConsentEffective,
              syntheticDataset: syntheticDatasetEffective,
            })
          }}
          disabled={disabled}
        >
          I Agree
        </button>
      </span>
      {disabled && (
        <span className="message">
          Please affirm defacing or participant consent under metadata before
          proceeding.
        </span>
      )}
    </div>
  )
}

UploadDisclaimer.propTypes = {
  showInputs: PropTypes.bool,
}

export default UploadDisclaimer
